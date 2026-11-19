#!/usr/bin/env python3
"""Kitchen tab agent.

Turns a USB-connected Samsung Galaxy Tab (any Android tablet) into a
kitchen dashboard: clock, date, weather, indoor climate, smart-meter
energy, kitchen timers.

The agent runs on the computer the tablet is plugged into. It:
  * finds the tablet with adb and reports model, Android version, battery
  * serves the dashboard and a small JSON API (weather, meter, indoor, device)
  * maps the port onto the tablet with `adb reverse`, so the tablet opens
    http://localhost:<port> (a secure context, so screen wake-lock works)
  * keeps the screen on while plugged in and opens the dashboard
  * watches the USB link and re-applies everything when the tab reconnects

Python 3.8+, standard library only. Needs `adb` (Android platform-tools).

Usage:
  python3 tab_agent.py check          # is the tab there? what is it?
  python3 tab_agent.py run            # serve + push to tab + keep alive
  python3 tab_agent.py run --demo     # fake weather/meter data, no tab needed
  python3 tab_agent.py serve          # serve only (open on any browser)
"""

import argparse
import json
import re
import os
import shutil
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(HERE, "web")
CONFIG_PATH = os.path.join(HERE, "config.json")
EXAMPLE_PATH = os.path.join(HERE, "config.example.json")

CONFIG = {}
DEMO = False
_cache = {}
_cache_lock = threading.Lock()
_device_state = {"connected": False}


# --------------------------------------------------------------------------
# config
# --------------------------------------------------------------------------

def load_config():
    path = CONFIG_PATH if os.path.exists(CONFIG_PATH) else EXAMPLE_PATH
    with open(path, encoding="utf-8") as f:
        cfg = json.load(f)
    if path == EXAMPLE_PATH:
        log("config.json not found, using config.example.json "
            "(copy it to config.json and edit)")
    return cfg


def save_eon_key(key):
    """Store the E.ON API key in config.json and use it straight away."""
    path = CONFIG_PATH if os.path.exists(CONFIG_PATH) else EXAMPLE_PATH
    with open(path, encoding="utf-8") as f:
        cfg = json.load(f)
    m = cfg.setdefault("meter", {})
    m["source"] = "eon"
    eon = m.setdefault("eon", {})
    eon["api_key"] = key
    eon.pop("password", None)
    eon.pop("email", None)
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2)
    CONFIG.clear()
    CONFIG.update(cfg)
    _eon.update(token=None, exp=0, refresh=None, refresh_exp=0, meters=None)
    with _cache_lock:
        _cache.pop("meter", None)
    log("E.ON API key saved to config.json")


def log(msg):
    print(time.strftime("[%H:%M:%S] ") + msg, flush=True)


# --------------------------------------------------------------------------
# adb
# --------------------------------------------------------------------------

def adb_path():
    p = shutil.which("adb")
    if p:
        return p
    for guess in (
        os.path.join(HERE, "platform-tools", "adb"),
        os.path.expanduser("~/platform-tools/adb"),
        os.path.expanduser("~/Downloads/platform-tools/adb"),
        os.path.expanduser("~/Library/Android/sdk/platform-tools/adb"),
        os.path.expanduser("~/Android/Sdk/platform-tools/adb"),
        "/opt/homebrew/bin/adb",
        "/usr/local/bin/adb",
    ):
        if os.path.exists(guess):
            return guess
    return None


def adb(*args, serial=None, timeout=15):
    exe = adb_path()
    if not exe:
        raise RuntimeError(
            "adb not found. Install Android platform-tools "
            "(macOS: brew install android-platform-tools)")
    cmd = [exe]
    if serial:
        cmd += ["-s", serial]
    cmd += list(args)
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    return r.stdout.strip()


def list_devices():
    out = adb("devices", "-l")
    devices = []
    for line in out.splitlines()[1:]:
        parts = line.split()
        if len(parts) < 2:
            continue
        info = {"serial": parts[0], "state": parts[1]}
        for p in parts[2:]:
            if ":" in p:
                k, v = p.split(":", 1)
                info[k] = v
        devices.append(info)
    return devices


def pick_device():
    """Prefer a Samsung tablet; fall back to the first authorised device."""
    want = CONFIG.get("tablet", {}).get("serial") or None
    devs = [d for d in list_devices() if d["state"] == "device"]
    if want:
        devs = [d for d in devs if d["serial"] == want]
    if not devs:
        return None
    for d in devs:
        if d.get("model", "").upper().startswith("SM_"):  # Samsung models
            return d["serial"]
    return devs[0]["serial"]


def device_info(serial):
    prop = lambda k: adb("shell", "getprop", k, serial=serial)
    info = {
        "serial": serial,
        "manufacturer": prop("ro.product.manufacturer"),
        "model": prop("ro.product.model"),
        "name": prop("ro.product.marketname") or prop("ro.config.marketing_name"),
        "android": prop("ro.build.version.release"),
        "sdk": prop("ro.build.version.sdk"),
    }
    size = adb("shell", "wm", "size", serial=serial)
    info["screen"] = size.split(":")[-1].strip() if size else ""
    info.update(battery(serial))
    return info


def battery(serial):
    out = adb("shell", "dumpsys", "battery", serial=serial)
    b = {}
    for line in out.splitlines():
        if ":" not in line:
            continue
        k, v = [s.strip() for s in line.split(":", 1)]
        if k == "level":
            b["battery"] = int(v)
        elif k == "temperature":
            b["battery_temp_c"] = int(v) / 10
        elif k in ("AC powered", "USB powered"):
            b["charging"] = b.get("charging", False) or v == "true"
    return b


def prepare_tablet(serial, port):
    t = CONFIG.get("tablet", {})
    adb("reverse", f"tcp:{port}", f"tcp:{port}", serial=serial)
    if t.get("keep_screen_on", True):
        # stay awake while charging over USB / AC
        adb("shell", "svc", "power", "stayon", "true", serial=serial)
    if t.get("screen_timeout_minutes"):
        ms = int(t["screen_timeout_minutes"]) * 60_000
        adb("shell", "settings", "put", "system", "screen_off_timeout",
            str(ms), serial=serial)
    if t.get("brightness") is not None:
        adb("shell", "settings", "put", "system", "screen_brightness_mode",
            "0", serial=serial)
        adb("shell", "settings", "put", "system", "screen_brightness",
            str(int(t["brightness"])), serial=serial)
    # wake + unlock (works when there is no PIN/pattern)
    adb("shell", "input", "keyevent", "KEYCODE_WAKEUP", serial=serial)
    adb("shell", "wm", "dismiss-keyguard", serial=serial)


def open_dashboard(serial, port):
    url = f"http://localhost:{port}/"
    browser = CONFIG.get("tablet", {}).get("browser", "chrome")
    pkg = {
        "chrome": "com.android.chrome",
        "samsung": "com.sec.android.app.sbrowser",
        "fully": "de.ozerov.fully",
        "default": None,
    }.get(browser)
    # same application_id = Chrome reuses one tab instead of opening a new one
    args = ["shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", url,
            "--es", "com.android.browser.application_id", "kitchen-board"]
    if pkg:
        args += ["-p", pkg]
    out = adb(*args, serial=serial)
    if "Error" in out and pkg:
        log(f"{browser} not available, falling back to default browser")
        adb("shell", "am", "start", "-a", "android.intent.action.VIEW",
            "-d", url, serial=serial)
    log(f"Opened {url} on the tablet")


def watch_tablet(port, interval=20):
    """Keep the USB link alive: re-apply reverse + reopen on reconnect."""
    was = None
    while True:
        try:
            serial = pick_device()
        except Exception as e:  # adb missing / crashed
            serial = None
            log(f"adb error: {e}")
        if serial and serial != was:
            try:
                info = device_info(serial)
                log("Tablet connected: {name} {model} (Android {android}), "
                    "screen {screen}, battery {battery}%".format(
                        **{k: info.get(k, "?") for k in
                           ("name", "model", "android", "screen", "battery")}))
                prepare_tablet(serial, port)
                open_dashboard(serial, port)
            except Exception as e:
                log(f"Could not prepare tablet: {e}")
        elif serial:
            try:
                adb("reverse", f"tcp:{port}", f"tcp:{port}", serial=serial)
            except Exception:
                pass
        elif was:
            log("Tablet disconnected - waiting for it to come back")
        if serial:
            try:
                _device_state.update(device_info(serial), connected=True)
            except Exception:
                pass
        else:
            _device_state.clear()
            _device_state["connected"] = False
        was = serial
        time.sleep(interval)


# --------------------------------------------------------------------------
# data sources
# --------------------------------------------------------------------------

def http_json(url, headers=None, timeout=10):
    req = urllib.request.Request(url, headers=headers or {})
    req.add_header("User-Agent", "kitchen-tab-agent/1.0")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def cached(key, ttl, fn):
    now = time.time()
    with _cache_lock:
        hit = _cache.get(key)
        if hit and now - hit[0] < ttl:
            return hit[1]
    try:
        val = fn()
    except Exception as e:
        log(f"{key}: {e}")
        if hit and "error" not in hit[1]:  # serve stale rather than nothing
            stale = dict(hit[1])
            stale["stale"] = True
            val = stale
        else:
            val = {"error": str(e)}
        # back off before trying again (E.ON blocks clients that retry fast)
        with _cache_lock:
            _cache[key] = (now - ttl + max(60, min(ttl, 900)), val)
        return val
    with _cache_lock:
        _cache[key] = (now, val)
    return val


def get_weather():
    loc = CONFIG.get("location", {})
    if DEMO:
        w = demo_weather()
        w["alerts"] = [{"level": "warn", "text": "\U0001F327 Rain likely in about 30 min"},
                       {"level": "warn", "text": "\u2744\ufe0f Frost likely - down to -1\u00b0 overnight"}]
        return w
    q = urllib.parse.urlencode({
        "latitude": loc.get("latitude"),
        "longitude": loc.get("longitude"),
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,"
                   "weather_code,wind_speed_10m,precipitation,is_day",
        "hourly": "temperature_2m,weather_code,precipitation_probability,wind_gusts_10m",
        "minutely_15": "precipitation",
        "forecast_minutely_15": 12,
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,"
                 "sunrise,sunset,precipitation_probability_max,uv_index_max",
        "timezone": "auto",
        "forecast_days": 5,
        "temperature_unit": CONFIG.get("units", {}).get("temperature", "celsius"),
        "wind_speed_unit": CONFIG.get("units", {}).get("wind", "kmh"),
    })
    w = http_json("https://api.open-meteo.com/v1/forecast?" + q)
    # outdoor air quality is a separate free endpoint; best effort
    try:
        aq = http_json(
            "https://air-quality-api.open-meteo.com/v1/air-quality?" +
            urllib.parse.urlencode({
                "latitude": loc.get("latitude"),
                "longitude": loc.get("longitude"),
                "current": "european_aqi,pm2_5,alder_pollen,birch_pollen,grass_pollen",
            }))
        w["air_quality"] = aq.get("current", {})
    except Exception:
        pass
    w["place"] = loc.get("name", "")
    w["alerts"] = weather_alerts(w)
    return w


def weather_alerts(w):
    """Plain-English heads-ups worked out from the forecast (not official warnings)."""
    out = []
    cur = w.get("current") or {}
    now = cur.get("time") or ""
    mph = CONFIG.get("units", {}).get("wind", "kmh") == "mph"
    # rain starting / stopping in the next 3 hours (15-minute data)
    m = w.get("minutely_15") or {}
    times, rain = m.get("time") or [], m.get("precipitation") or []
    upcoming = [(t, r or 0) for t, r in zip(times, rain) if t > now][:12]
    wet_now = (cur.get("precipitation") or 0) >= 0.1
    for n, (t, r) in enumerate(upcoming):
        mins = (n + 1) * 15
        if not wet_now and r >= 0.2:
            out.append({"level": "warn", "text": f"\U0001F327 Rain likely in about {mins} min"})
            break
        if wet_now and r < 0.05 and all((x or 0) < 0.05 for _, x in upcoming[n:n + 2]):
            out.append({"level": "info", "text": f"\U0001F324 Rain should stop in about {mins} min"})
            break
    h = w.get("hourly") or {}
    ht = h.get("time") or []
    idx = [i for i, t in enumerate(ht) if t >= now[:13]][:18]
    temps = [h["temperature_2m"][i] for i in idx if h.get("temperature_2m")]
    if temps and min(temps) <= 0:
        out.append({"level": "warn", "text": f"\u2744\ufe0f Frost likely - down to {round(min(temps))}\u00b0 overnight"})
    gusts = [h["wind_gusts_10m"][i] or 0 for i in idx[:12] if h.get("wind_gusts_10m")]
    if gusts and max(gusts) >= (37 if mph else 60):
        out.append({"level": "warn", "text": f"\U0001F4A8 Gusts up to {round(max(gusts))} {'mph' if mph else 'km/h'} today"})
    d = w.get("daily") or {}
    try:
        uv = d["uv_index_max"][0]
        if uv >= 6:
            out.append({"level": "warn", "text": f"\u2600\ufe0f High UV today ({round(uv)}) - sun cream"})
        if d["temperature_2m_max"][0] >= 28:
            out.append({"level": "warn", "text": f"\U0001F975 Hot today - up to {round(d['temperature_2m_max'][0])}\u00b0"})
        if not any("Rain" in a["text"] for a in out) and d["precipitation_probability_max"][0] >= 80:
            out.append({"level": "info", "text": "\u2614 Rain very likely today - take a coat"})
    except (KeyError, IndexError, TypeError):
        pass
    aq = w.get("air_quality") or {}
    for key, name in (("grass_pollen", "grass"), ("birch_pollen", "birch"), ("alder_pollen", "alder")):
        v = aq.get(key)
        if v is not None and v >= 50:
            out.append({"level": "warn", "text": f"\U0001F33E High {name} pollen today"})
    return out


# --- calendar (.ics links from Google / iCloud / Outlook) --------------------
from datetime import datetime as _dt, date as _date, timedelta as _td

_WD = {"MO": 0, "TU": 1, "WE": 2, "TH": 3, "FR": 4, "SA": 5, "SU": 6}


def http_text(url, timeout=20):
    if url.startswith("webcal://"):
        url = "https://" + url[len("webcal://"):]
    req = urllib.request.Request(url, headers={"User-Agent": "kitchen-tab-agent/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def _ics_time(value, params):
    """-> (aware datetime in local time, all_day)"""
    local = _dt.now().astimezone().tzinfo
    v = value.strip()
    if params.get("VALUE") == "DATE" or (len(v) == 8 and v.isdigit()):
        d = _date(int(v[:4]), int(v[4:6]), int(v[6:8]))
        return _dt(d.year, d.month, d.day, tzinfo=local), True
    t = _dt.strptime(v[:15], "%Y%m%dT%H%M%S")
    if v.endswith("Z"):
        from datetime import timezone
        return t.replace(tzinfo=timezone.utc).astimezone(local), False
    tz = local
    if params.get("TZID"):
        try:
            from zoneinfo import ZoneInfo
            tz = ZoneInfo(params["TZID"].strip('"'))
        except Exception:
            tz = local
    return t.replace(tzinfo=tz).astimezone(local), False


def _ics_events(text):
    lines = []
    for raw in text.replace("\r\n", "\n").split("\n"):
        if raw[:1] in (" ", "\t") and lines:
            lines[-1] += raw[1:]
        else:
            lines.append(raw)
    events, cur = [], None
    for ln in lines:
        if ln == "BEGIN:VEVENT":
            cur = {"exdates": []}
        elif ln == "END:VEVENT":
            if cur is not None:
                events.append(cur)
            cur = None
        elif cur is not None and ":" in ln:
            head, value = ln.split(":", 1)
            parts = head.split(";")
            name = parts[0].upper()
            params = dict(p.split("=", 1) for p in parts[1:] if "=" in p)
            if name in ("DTSTART", "DTEND", "RECURRENCE-ID"):
                try:
                    cur[name] = _ics_time(value, params)
                except ValueError:
                    pass
            elif name == "EXDATE":
                for v in value.split(","):
                    try:
                        cur["exdates"].append(_ics_time(v, params)[0])
                    except ValueError:
                        pass
            elif name == "SUMMARY":
                cur["SUMMARY"] = value.replace("\\,", ",").replace("\\;", ";").replace("\\n", " ").strip()
            elif name in ("RRULE", "UID", "STATUS", "DURATION"):
                cur[name] = value.strip()
    return events


def _rrule_starts(start, rule, until_limit):
    """Yield occurrence start datetimes for common RRULEs (DAILY/WEEKLY/MONTHLY/YEARLY)."""
    r = dict(p.split("=", 1) for p in rule.split(";") if "=" in p)
    freq, interval = r.get("FREQ"), int(r.get("INTERVAL", "1") or 1)
    count = int(r["COUNT"]) if "COUNT" in r else None
    until = None
    if "UNTIL" in r:
        try:
            until = _ics_time(r["UNTIL"], {})[0]
        except ValueError:
            until = None
    byday = [b for b in r.get("BYDAY", "").split(",") if b]
    bymonthday = [int(x) for x in r.get("BYMONTHDAY", "").split(",") if x.lstrip("-").isdigit()]
    n, guard = 0, 0

    def ok(t):
        return (until is None or t <= until) and t <= until_limit

    if freq == "DAILY":
        t = start
        while ok(t) and guard < 20000:
            guard += 1
            yield t
            n += 1
            if count and n >= count:
                return
            t += _td(days=interval)
    elif freq == "WEEKLY":
        days = sorted(_WD[b[-2:]] for b in byday) or [start.weekday()]
        week0 = start - _td(days=start.weekday())
        k = 0
        while guard < 5000:
            guard += 1
            base = week0 + _td(weeks=k * interval)
            for wd in days:
                t = base + _td(days=wd)
                if t < start:
                    continue
                if not ok(t):
                    return
                yield t
                n += 1
                if count and n >= count:
                    return
            k += 1
    elif freq in ("MONTHLY", "YEARLY"):
        import calendar as _cal
        y, mth, k = start.year, start.month, 0
        while guard < 3000:
            guard += 1
            cands = []
            dim = _cal.monthrange(y, mth)[1]
            if freq == "YEARLY" and mth != start.month:
                pass
            elif bymonthday:
                cands = [d if d > 0 else dim + 1 + d for d in bymonthday]
            elif byday:
                for b in byday:
                    wd = _WD[b[-2:]]
                    nth = int(b[:-2]) if b[:-2].lstrip("-").isdigit() else 0
                    matches = [d for d in range(1, dim + 1) if _date(y, mth, d).weekday() == wd]
                    if nth > 0 and nth <= len(matches):
                        cands.append(matches[nth - 1])
                    elif nth < 0 and -nth <= len(matches):
                        cands.append(matches[nth])
                    elif nth == 0:
                        cands.extend(matches)
            else:
                cands = [start.day] if start.day <= dim else []
            for d in sorted(set(cands)):
                if 1 <= d <= dim:
                    t = start.replace(year=y, month=mth, day=d)
                    if t < start:
                        continue
                    if not ok(t):
                        return
                    yield t
                    n += 1
                    if count and n >= count:
                        return
            if freq == "YEARLY":
                y += interval
            else:
                mth += interval
                while mth > 12:
                    mth -= 12
                    y += 1
            if _dt(y, mth, 1, tzinfo=start.tzinfo) > until_limit:
                return


def calendar_events(texts, days=2):
    local = _dt.now().astimezone().tzinfo
    now = _dt.now(local)
    win_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    win_end = win_start + _td(days=days)
    found = []
    for text in texts:
        evs = _ics_events(text)
        moved = {}
        for e in evs:
            if "RECURRENCE-ID" in e and "UID" in e:
                moved.setdefault(e["UID"], []).append(e["RECURRENCE-ID"][0])
        for e in evs:
            if "DTSTART" not in e or e.get("STATUS", "").upper() == "CANCELLED":
                continue
            start, all_day = e["DTSTART"]
            if "DTEND" in e:
                length = e["DTEND"][0] - start
            elif all_day:
                length = _td(days=1)
            else:
                length = _td(0)
            if "RRULE" in e and "RECURRENCE-ID" not in e:
                skip = set(e["exdates"]) | set(moved.get(e.get("UID"), []))
                starts = (t for t in _rrule_starts(start, e["RRULE"], win_end) if t not in skip)
            else:
                starts = [start]
            for t in starts:
                end = t + length
                if t < win_end and (end > now if length else t >= now - _td(minutes=30)):
                    if end > win_start or t >= win_start:
                        found.append((t, all_day, e.get("SUMMARY", "(no title)")))
    found.sort(key=lambda x: (x[0].date(), not x[1], x[0]))
    out = []
    for t, all_day, title in found[:12]:
        day = (t.date() - now.date()).days
        label = "Today" if day <= 0 else "Tomorrow" if day == 1 else t.strftime("%a")
        out.append({"day": label, "time": "" if all_day else t.strftime("%H:%M"),
                    "title": title[:80], "all_day": all_day})
    return out


def get_calendar():
    c = CONFIG.get("calendar", {})
    urls = [u for u in c.get("ics_urls", []) if u]
    if DEMO and not urls:
        return {"events": [{"day": "Today", "time": "18:00", "title": "Swimming", "all_day": False},
                           {"day": "Tomorrow", "time": "", "title": "Bin day", "all_day": True},
                           {"day": "Tomorrow", "time": "09:30", "title": "Dentist", "all_day": False}]}
    if not urls:
        return {"events": [], "source": "none"}
    texts = []
    for u in urls:
        try:
            texts.append(http_text(u))
        except Exception as e:
            log("calendar: " + str(e)[:120])
    if not texts:
        raise RuntimeError("calendar link not reachable")
    return {"events": calendar_events(texts, int(c.get("days", 2)))}


# --- night / idle photo frame ------------------------------------------------
PHOTO_EXT = (".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif")
PHOTO_CACHE = os.path.join(HERE, ".photo-cache")
_photo_index = {"names": {}, "at": 0}


def photo_cfg():
    p = CONFIG.get("photos", {})
    return {
        "enabled": p.get("enabled", True),
        "folder": os.path.expanduser(p.get("folder") or "~/Pictures/Kitchen Board"),
        "night_start": p.get("night_start", 21), "night_end": p.get("night_end", 7),
        "idle_minutes": p.get("idle_minutes", 10),
        "seconds_per_photo": p.get("seconds_per_photo", 20),
        "max_size": int(p.get("max_size", 1280)),
    }


def list_photos():
    """Map public id -> source path for photos in the folder (refreshed each minute)."""
    import hashlib
    c = photo_cfg()
    if time.time() - _photo_index["at"] < 60 and _photo_index["names"]:
        return _photo_index["names"]
    names = {}
    folder = c["folder"]
    if c["enabled"] and os.path.isdir(folder):
        for root, _dirs, files in os.walk(folder):
            for fn in files:
                if fn.startswith(".") or not fn.lower().endswith(PHOTO_EXT):
                    continue
                full = os.path.join(root, fn)
                try:
                    st = os.stat(full)
                except OSError:
                    continue
                pid = hashlib.sha1(f"{full}|{st.st_mtime}|{st.st_size}".encode()).hexdigest()[:16]
                names[pid] = full
    _photo_index.update(names=names, at=time.time())
    return names


def photo_file(pid):
    """Return (path, content_type) for a photo, shrunk/converted to JPEG on macOS."""
    src = list_photos().get(pid)
    if not src:
        return None, None
    sips = shutil.which("sips")  # built into macOS
    ext = os.path.splitext(src)[1].lower()
    if sips:
        os.makedirs(PHOTO_CACHE, exist_ok=True)
        out = os.path.join(PHOTO_CACHE, pid + ".jpg")
        if not os.path.exists(out):
            r = subprocess.run([sips, "-s", "format", "jpeg", "-s", "formatOptions", "80",
                                "-Z", str(photo_cfg()["max_size"]), src, "--out", out],
                               capture_output=True, timeout=60)
            if r.returncode != 0 or not os.path.exists(out):
                out = None
        if out:
            return out, "image/jpeg"
    if ext in (".heic", ".heif"):
        return None, None  # browsers can't show HEIC without conversion
    ctype = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
             ".gif": "image/gif", ".webp": "image/webp"}[ext]
    return src, ctype


def get_photos():
    c = photo_cfg()
    if c["enabled"] and not os.path.isdir(c["folder"]):
        try:
            os.makedirs(c["folder"], exist_ok=True)
            log(f"Created photo folder {c['folder']} - put photos there for the night frame")
        except OSError:
            pass
    ids = list(list_photos().keys())
    return {"enabled": c["enabled"] and bool(ids), "photos": ids, "count": len(ids),
            "night_start": c["night_start"], "night_end": c["night_end"],
            "idle_minutes": c["idle_minutes"], "seconds_per_photo": c["seconds_per_photo"]}


def get_news():
    n = CONFIG.get("news", {})
    if n.get("enabled", True) is False:
        return {"headlines": []}
    if DEMO:
        return {"headlines": ["Demo headline: council approves new park",
                              "Demo headline: trains running normally"]}
    import xml.etree.ElementTree as ET
    root = ET.fromstring(http_text(n.get("feed", "https://feeds.bbci.co.uk/news/rss.xml")))
    titles = [i.findtext("title", "").strip() for i in root.iter("item")]
    return {"headlines": [t for t in titles if t][:int(n.get("count", 8))],
            "source": n.get("name", "BBC News")}


def ha_state(entity):
    ha = CONFIG["homeassistant"]
    url = ha["url"].rstrip("/") + "/api/states/" + entity
    return http_json(url, {"Authorization": "Bearer " + ha["token"]})


def ha_value(entity):
    if not entity:
        return None
    s = ha_state(entity)
    try:
        return float(s["state"])
    except (TypeError, ValueError):
        return None


def get_meter():
    m = CONFIG.get("meter", {})
    src = "demo" if DEMO else str(m.get("source") or "none").strip().lower()
    # accept "E.ON", "e.on next", "eonnext", "Home Assistant", ...
    key = "".join(ch for ch in src if ch.isalnum())
    src = {"eon": "eon", "eonnext": "eon", "eonenergy": "eon",
           "homeassistant": "homeassistant", "ha": "homeassistant",
           "octopus": "octopus", "octopusenergy": "octopus",
           "none": "none", "": "none", "demo": "demo"}.get(key, src)
    tariff = m.get("price_per_kwh")
    currency = m.get("currency", "£")
    if src == "none":
        return {"source": "none"}
    if src == "demo":
        t = time.time()
        power = 380 + 260 * abs(((t / 40) % 2) - 1)
        out = {"power_w": round(power), "today_kwh": 6.42,
               "yesterday_kwh": 9.1, "gas_today_kwh": 18.3}
    elif src == "homeassistant":
        e = m.get("entities", {})
        out = {
            "power_w": ha_value(e.get("power_w")),
            "today_kwh": ha_value(e.get("today_kwh")),
            "yesterday_kwh": ha_value(e.get("yesterday_kwh")),
            "gas_today_kwh": ha_value(e.get("gas_today_kwh")),
        }
    elif src == "octopus":
        out = octopus_usage(m.get("octopus", {}))
    elif src == "eon":
        out = eon_usage(m.get("eon", {}))
    else:
        return {"error": f"unknown meter source {src}"}
    out["source"] = src
    out["currency"] = currency
    if tariff and out.get("today_kwh") is not None:
        sc = m.get("standing_charge_per_day", 0) or 0
        out["today_cost"] = round(out["today_kwh"] * tariff + sc, 2)
    return out


def octopus_usage(o):
    """Octopus Energy (UK) smart meter consumption, half-hourly, ~1 day lag."""
    import base64
    auth = base64.b64encode((o["api_key"] + ":").encode()).decode()
    base = "https://api.octopus.energy/v1/electricity-meter-points/{}/meters/{}/consumption/".format(
        o["mpan"], o["serial"])
    data = http_json(base + "?page_size=96&order_by=period",
                     {"Authorization": "Basic " + auth})
    rows = data.get("results", [])
    days = {}
    for r in rows:
        days.setdefault(r["interval_start"][:10], 0.0)
        days[r["interval_start"][:10]] += r["consumption"]
    keys = sorted(days)
    out = {"power_w": None, "today_kwh": None, "yesterday_kwh": None}
    if keys:
        out["latest_day"] = keys[-1]
        out["latest_day_kwh"] = round(days[keys[-1]], 2)
        out["today_kwh"] = out["latest_day_kwh"]
        if len(keys) > 1:
            out["yesterday_kwh"] = round(days[keys[-2]], 2)
    if rows:
        last = rows[-1]
        out["last_half_hour_kwh"] = last["consumption"]
        out["power_w"] = round(last["consumption"] * 2000)  # avg W in slot
        out["note"] = "Octopus data lags ~24h"
    return out


# --- E.ON Next (UK) -------------------------------------------------------
# No official public API. E.ON Next runs on Kraken; these GraphQL calls are
# the ones the E.ON Next website uses, as used by the community Home
# Assistant integration github.com/madmachinations/eon-next. Smart meters
# send readings roughly daily, so this gives "usage per day", not live watts.

EON_GQL = "https://api.eonnext-kraken.energy/v1/graphql/"
_eon = {"token": None, "exp": 0, "refresh": None, "refresh_exp": 0, "meters": None}

_EON_LOGIN = ("mutation obtainKrakenToken($input: ObtainJSONWebTokenInput!) "
              "{obtainKrakenToken(input: $input) {payload refreshExpiresIn refreshToken token}}")
_EON_ACCOUNTS = "query headerGetLoggedInUser { viewer { accounts { ... on AccountType { number } } } }"
_EON_METERS = (
    "query getAccountMeterSelector($accountNumber: String!, $showInactive: Boolean!) {"
    " properties(accountNumber: $accountNumber) {"
    "  electricityMeterPoints { meters(includeInactive: $showInactive) { id serialNumber } }"
    "  gasMeterPoints { meters(includeInactive: $showInactive) { id serialNumber } } } }")
_EON_READINGS = (
    "query r($accountNumber: String!, $cursor: String, $meterId: String!) {"
    " readings: %sMeterReadings(accountNumber: $accountNumber, after: $cursor,"
    " first: 12, meterId: $meterId) { edges { node { readAt registers { name value } } } } }")


def _redact(msg):
    """Never let credentials echoed by the API reach logs or the screen."""
    msg = re.sub(r"got invalid value \{.*?\};", "got invalid value [hidden];", msg)
    eon = CONFIG.get("meter", {}).get("eon", {})
    esi = CONFIG.get("indoor", {}).get("esi", {})
    for secret in (eon.get("password"), eon.get("api_key"), esi.get("password")):
        if secret and len(secret) > 4:
            msg = msg.replace(secret, "[hidden]")
    msg = re.sub(r"sk_live_\w+", "sk_live_[hidden]", msg)
    return msg


def eon_gql(query, variables=None, auth=True):
    headers = {"Content-Type": "application/json"}
    if auth:
        headers["Authorization"] = "JWT " + eon_token()
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(EON_GQL, data=body, headers=headers, method="POST")
    req.add_header("User-Agent", "kitchen-tab-agent/1.0")
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            res = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        # Kraken puts the useful message in the body of 4xx replies
        body = e.read().decode("utf-8", "replace")
        try:
            errs = json.loads(body).get("errors") or []
            msg = "; ".join(x.get("message", "") for x in errs) or body[:200]
        except ValueError:
            msg = body[:200]
        msg = _redact(msg)
        if auth and e.code in (400, 401):
            _eon["token"] = None  # force a fresh login next time
        raise RuntimeError(f"E.ON HTTP {e.code}: {msg}")
    if res.get("errors") and not res.get("data"):
        raise RuntimeError("E.ON: " + _redact(res["errors"][0].get("message", "error")))
    return res.get("data") or {}


def eon_token():
    now = time.time()
    if _eon["token"] and _eon["exp"] - 60 > now:
        return _eon["token"]
    cfg = CONFIG.get("meter", {}).get("eon", {})
    if _eon["refresh"] and _eon["refresh_exp"] > now:
        inp = {"refreshToken": _eon["refresh"]}
    else:
        key = (cfg.get("api_key") or "").strip()
        if not key.startswith("sk_"):
            raise RuntimeError("E.ON needs an API key (sk_live_...) since Oct 2026 - "
                               "see README 'E.ON API key'")
        inp = {"APIKey": key}
    d = eon_gql(_EON_LOGIN, {"input": inp}, auth=False).get("obtainKrakenToken")
    if not d or not d.get("token"):
        _eon["refresh"] = None
        raise RuntimeError("E.ON login failed - check the API key")
    _eon.update(token=d["token"], exp=d["payload"]["exp"],
                refresh=d.get("refreshToken"), refresh_exp=d.get("refreshExpiresIn") or 0)
    return d["token"]


def eon_meters():
    if _eon["meters"] is None:
        acct = CONFIG.get("meter", {}).get("eon", {}).get("account_number")
        accounts = [acct] if acct else [
            a["number"] for a in eon_gql(_EON_ACCOUNTS)["viewer"]["accounts"]]
        meters = []
        for num in accounts:
            for prop in eon_gql(_EON_METERS, {"accountNumber": num,
                                              "showInactive": False})["properties"]:
                for kind, key in (("electricity", "electricityMeterPoints"),
                                  ("gas", "gasMeterPoints")):
                    for point in prop.get(key) or []:
                        for m in point.get("meters") or []:
                            meters.append({"kind": kind, "id": m["id"],
                                           "serial": m["serialNumber"], "account": num})
        _eon["meters"] = meters
    return _eon["meters"]


def gas_m3_to_kwh(m3, calorific=38.0):
    return m3 * 1.02264 * calorific / 3.6


def eon_readings(meter):
    data = eon_gql(_EON_READINGS % meter["kind"], {
        "accountNumber": meter["account"], "cursor": "", "meterId": meter["id"]})
    rows = []
    for e in (data.get("readings") or {}).get("edges", []):
        n = e["node"]
        total = sum(float(r["value"]) for r in n.get("registers") or [])  # sum day/night
        rows.append((n["readAt"], total))
    rows.sort()
    return rows


def eon_usage(cfg):
    """Latest two meter readings per fuel -> kWh/day since the previous one."""
    out = {"power_w": None, "today_kwh": None, "yesterday_kwh": None}
    from datetime import datetime
    seen = set()
    for meter in eon_meters():
        if meter["kind"] in seen:
            continue
        rows = eon_readings(meter)
        if not rows:
            continue
        seen.add(meter["kind"])
        last_at, last = rows[-1]
        if meter["kind"] == "gas" and cfg.get("gas_units", "m3") == "m3":
            conv = lambda v: gas_m3_to_kwh(v, cfg.get("gas_calorific_value", 38.0))
        else:
            conv = lambda v: v
        per_day = None
        if len(rows) > 1:
            prev_at, prev = rows[-2]
            days = (datetime.fromisoformat(last_at.replace("Z", "+00:00")) -
                    datetime.fromisoformat(prev_at.replace("Z", "+00:00"))).total_seconds() / 86400
            if days > 0:
                per_day = round(conv(last - prev) / days, 2)
        if meter["kind"] == "electricity":
            out.update(today_kwh=per_day, latest_day_kwh=per_day,
                       reading=round(last), reading_date=last_at[:10])
            if len(rows) > 2:
                p2_at, p2 = rows[-3]
                d2 = (datetime.fromisoformat(rows[-2][0].replace("Z", "+00:00")) -
                      datetime.fromisoformat(p2_at.replace("Z", "+00:00"))).total_seconds() / 86400
                if d2 > 0:
                    out["yesterday_kwh"] = round((rows[-2][1] - p2) / d2, 2)
        else:
            out["gas_today_kwh"] = per_day
    if "reading_date" in out:
        out["note"] = "E.ON reading " + out["reading_date"] + " · kWh per day"
    return out


# --- ESi Centro thermostat (UK) ---------------------------------------------
# No official API. These are the calls the ESi Centro app makes, as used by
# the community library pyesicentro (PyPI) and the Moby's Heat dashboard
# (github.com/cs97jjm3/mobys-heat). Temperatures come back in tenths of a degree.

ESI_BASE = "https://esiheating.uksouth.cloudapp.azure.com/centro/"
_esi = {"user_id": None, "token": None, "at": 0}


def esi_call(method, name, params):
    url = ESI_BASE + name + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, method=method, data=b"" if method == "POST" else None)
    req.add_header("User-Agent", "kitchen-tab-agent/1.0")
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"ESi HTTP {e.code}") from None
    except urllib.error.URLError as e:
        raise RuntimeError(f"ESi unreachable: {e.reason}") from None


def esi_login(email, password):
    res = esi_call("POST", "login", {"email": email, "password": password})
    if res.get("error_code") != 0 or not res.get("user"):
        raise RuntimeError("ESi login failed: " + _redact(str(res.get("message") or "check email/password")))
    _esi.update(user_id=res["user"]["id"], token=res["user"]["token"], at=time.time())


def esi_devices(cfg):
    if not _esi["token"] or time.time() - _esi["at"] > 1500:  # tokens last ~30 min
        esi_login(cfg.get("email", ""), cfg.get("password", ""))
    params = {"device_type": "02", "user_id": _esi["user_id"], "token": _esi["token"]}
    res = esi_call("GET", "getDeviceList", params)
    if res.get("statu") is not True:  # token expired? log in once more
        esi_login(cfg.get("email", ""), cfg.get("password", ""))
        params.update(user_id=_esi["user_id"], token=_esi["token"])
        res = esi_call("GET", "getDeviceList", params)
    return res.get("devices") or []


def _tenths(v):
    try:
        return int(v) / 10
    except (TypeError, ValueError):
        return None


def esi_indoor(cfg):
    devs = esi_devices(cfg)
    if not devs:
        raise RuntimeError("ESi: no thermostats on this account")
    want = (cfg.get("device_name") or "").strip().lower()
    d = next((x for x in devs if want and str(x.get("device_name", "")).lower() == want), devs[0])
    return {"temperature": _tenths(d.get("inside_temparature")),
            "target": _tenths(d.get("current_temprature")),
            "humidity": None, "co2": None,
            "name": d.get("device_name"), "online": d.get("online"),
            "source": "esi"}


def get_indoor():
    i = CONFIG.get("indoor", {})
    if DEMO:
        return {"temperature": 21.4, "humidity": 48, "source": "demo"}
    if str(i.get("source", "")).lower() in ("esi", "esi centro", "esicentro"):
        return esi_indoor(i.get("esi", {}))
    if i.get("source") == "homeassistant":
        e = i.get("entities", {})
        return {"temperature": ha_value(e.get("temperature")),
                "humidity": ha_value(e.get("humidity")),
                "co2": ha_value(e.get("co2")),
                "source": "homeassistant"}
    return {"source": "none"}


def demo_weather():
    now = time.localtime()
    hours = [time.strftime("%Y-%m-%dT%H:00",
                           time.localtime(time.time() + h * 3600)) for h in range(48)]
    days = [time.strftime("%Y-%m-%d", time.localtime(time.time() + d * 86400))
            for d in range(5)]
    return {
        "place": CONFIG.get("location", {}).get("name", "Demo"),
        "current": {"temperature_2m": 8.6, "relative_humidity_2m": 81,
                    "apparent_temperature": 6.1, "weather_code": 61,
                    "wind_speed_10m": 17, "precipitation": 0.4, "is_day": 1},
        "current_units": {"temperature_2m": "°C", "wind_speed_10m": "km/h"},
        "hourly": {"time": hours,
                   "temperature_2m": [8 + (h % 24 - 12) * -0.3 for h in range(48)],
                   "weather_code": [61, 61, 3, 3, 2, 1] * 8,
                   "precipitation_probability": [70, 60, 40, 20, 10, 5] * 8},
        "daily": {"time": days, "weather_code": [61, 3, 1, 0, 80],
                  "temperature_2m_max": [10, 11, 9, 12, 8],
                  "temperature_2m_min": [4, 5, 2, 3, 1],
                  "sunrise": [d + "T07:31" for d in days],
                  "sunset": [d + "T16:05" for d in days],
                  "precipitation_probability_max": [80, 30, 10, 5, 60],
                  "uv_index_max": [1, 1.5, 2, 2, 1]},
        "air_quality": {"european_aqi": 24, "pm2_5": 6.1},
        "tm": now.tm_hour,
    }


# --------------------------------------------------------------------------
# http
# --------------------------------------------------------------------------

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=WEB_DIR, **kw)

    def log_message(self, fmt, *args):
        if "/api/" not in str(args[0] if args else ""):
            super().log_message(fmt, *args)

    def send_json(self, obj):
        body = json.dumps(obj).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    # --- one-click E.ON key: the bookmarklet on eonnext.com posts the key here
    EON_ORIGINS = ("https://www.eonnext.com", "https://eonnext.com")

    def _cors(self):
        origin = self.headers.get("Origin", "")
        if origin in self.EON_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Access-Control-Allow-Private-Network", "true")
        return origin in self.EON_ORIGINS

    def do_OPTIONS(self):
        allowed = self.headers.get("Origin", "") in self.EON_ORIGINS
        self.send_response(204 if allowed else 403)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def end_headers(self):
        # never let the tablet keep an old copy of the page
        if not self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def end_headers_raw(self):
        super().end_headers()

    def do_POST(self):
        if self.path.split("?")[0] == "/api/log":
            n = min(int(self.headers.get("Content-Length") or 0), 2000)
            log("[tablet] " + self.rfile.read(n).decode("utf-8", "replace"))
            self.send_response(204)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        if self.path.split("?")[0] != "/api/eon-key":
            self.send_error(404)
            return
        n = min(int(self.headers.get("Content-Length") or 0), 4096)
        key = self.rfile.read(n).decode("utf-8", "replace").strip()
        ok = False
        if self.headers.get("Origin", "") in self.EON_ORIGINS and re.fullmatch(r"sk_live_\w{8,200}", key):
            save_eon_key(key)
            ok = True
        body = json.dumps({"saved": ok}).encode()
        self.send_response(200 if ok else 403)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?")[0]
        ttl = CONFIG.get("refresh_seconds", {})
        if path == "/api/config":
            return self.send_json({
                "location": CONFIG.get("location", {}),
                "units": CONFIG.get("units", {}),
                "locale": CONFIG.get("locale"),
                "clock_24h": CONFIG.get("clock_24h", True),
                "night_mode": CONFIG.get("night_mode", {}),
                "title": CONFIG.get("title", "Kitchen"),
                "demo": DEMO,
            })
        if path == "/api/weather":
            return self.send_json(cached("weather", ttl.get("weather", 600), get_weather))
        if path == "/api/meter":
            mttl = ttl.get("meter", 10)
            if str(CONFIG.get("meter", {}).get("source", "")).lower().replace(".", "").startswith("eon"):
                mttl = max(mttl, 1800)
            return self.send_json(cached("meter", mttl, get_meter))
        if path == "/api/indoor":
            ittl = ttl.get("indoor", 30)
            if str(CONFIG.get("indoor", {}).get("source", "")).lower().startswith("esi"):
                ittl = max(ittl, 120)
            return self.send_json(cached("indoor", ittl, get_indoor))
        if path == "/api/device":
            return self.send_json(dict(_device_state))
        if path == "/api/calendar":
            return self.send_json(cached("calendar", ttl.get("calendar", 600), get_calendar))
        if path == "/api/news":
            return self.send_json(cached("news", ttl.get("news", 900), get_news))
        if path == "/api/photos":
            return self.send_json(get_photos())
        if path.startswith("/photo/"):
            pid = path[len("/photo/"):]
            fpath, ctype = photo_file(pid) if re.fullmatch(r"[0-9a-f]{16}", pid) else (None, None)
            if not fpath:
                self.send_error(404)
                return
            with open(fpath, "rb") as f:
                body = f.read()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "max-age=86400")
            self.end_headers_raw()
            self.wfile.write(body)
            return
        return super().do_GET()


def serve(port, bind):
    try:
        httpd = ThreadingHTTPServer((bind, port), Handler)
    except OSError as e:
        if e.errno in (48, 98, 10048):  # address already in use (mac/linux/win)
            log(f"Port {port} is already in use - the board is probably already "
                f"running in another Terminal window.\n"
                f"  Stop it:   lsof -ti tcp:{port} | xargs kill\n"
                f"  Or run on another port:   python3 tab_agent.py run --port {port + 5}")
            sys.exit(1)
        raise
    log(f"Dashboard on http://{'localhost' if bind == '127.0.0.1' else bind}:{port}/")
    httpd.serve_forever()


# --------------------------------------------------------------------------
# cli
# --------------------------------------------------------------------------

def cmd_setup_esi():
    """Ask for the ESi Centro login, test it, list thermostats, save."""
    import getpass
    print("ESi thermostat setup - use the same login as the ESi Centro app.")
    email = input("ESi Centro email: ").strip()
    password = getpass.getpass("ESi Centro password (hidden): ")
    CONFIG.setdefault("indoor", {})["esi"] = {"email": email, "password": password}
    try:
        devs = esi_devices({"email": email, "password": password})
    except Exception as e:
        print("Could not log in:", _redact(str(e)))
        return 1
    if not devs:
        print("Logged in, but no thermostats on this account.")
        return 1
    for n, d in enumerate(devs, 1):
        print(f"  {n}. {d.get('device_name')}: room {_tenths(d.get('inside_temparature'))}°C, "
              f"set to {_tenths(d.get('current_temprature'))}°C")
    pick = devs[0]
    if len(devs) > 1:
        a = input(f"Which one is the kitchen? [1-{len(devs)}]: ").strip()
        if a.isdigit() and 1 <= int(a) <= len(devs):
            pick = devs[int(a) - 1]
    path = CONFIG_PATH if os.path.exists(CONFIG_PATH) else EXAMPLE_PATH
    with open(path, encoding="utf-8") as f:
        cfg = json.load(f)
    cfg.setdefault("indoor", {}).update(
        source="esi", esi={"email": email, "password": password,
                           "device_name": pick.get("device_name")})
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2)
    print(f"Saved. The Indoors tile will show '{pick.get('device_name')}'. "
          "Restart the board: python3 tab_agent.py run")
    return 0


def cmd_add_calendar():
    print("Paste your calendar's private iCal (.ics) link.")
    print("  Google: calendar.google.com > Settings > your calendar > 'Secret address in iCal format'")
    print("  iCloud: Calendar app > share calendar > Public Calendar > copy link")
    url = input("Link: ").strip()
    if not url:
        return 1
    try:
        evs = calendar_events([http_text(url)], 7)
    except Exception as e:
        print("Could not read that link:", str(e)[:150])
        return 1
    print(f"OK - {len(evs)} event(s) in the next 7 days" + (":" if evs else "."))
    for e in evs[:5]:
        print(f"  {e['day']} {e['time'] or 'all day'}  {e['title']}")
    path = CONFIG_PATH if os.path.exists(CONFIG_PATH) else EXAMPLE_PATH
    with open(path, encoding="utf-8") as f:
        cfg = json.load(f)
    cal = cfg.setdefault("calendar", {})
    urls = cal.setdefault("ics_urls", [])
    if url not in urls:
        urls.append(url)
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2)
    print("Saved. Restart the board: python3 tab_agent.py run")
    return 0


def cmd_check():
    exe = adb_path()
    if not exe:
        print("adb not found. Install Android platform-tools first:")
        print("  macOS:   brew install android-platform-tools")
        print("  Windows: winget install Google.PlatformTools")
        print("  Linux:   sudo apt install adb")
        return 1
    devs = list_devices()
    if not devs:
        print("No device found. On the tablet: Settings > About tablet > "
              "Software information > tap 'Build number' 7 times, then "
              "Settings > Developer options > USB debugging ON. Replug the cable.")
        return 1
    for d in devs:
        if d["state"] == "unauthorized":
            print(f"{d['serial']}: unauthorised - accept the 'Allow USB "
                  "debugging?' prompt on the tablet (tick 'Always allow').")
            continue
        if d["state"] != "device":
            print(f"{d['serial']}: {d['state']}")
            continue
        info = device_info(d["serial"])
        print(json.dumps(info, indent=2))
    return 0


def main():
    global CONFIG, DEMO
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("command", choices=["check", "run", "serve", "setup-esi", "add-calendar"], nargs="?",
                    default="run")
    ap.add_argument("--port", type=int, default=None)
    ap.add_argument("--lan", action="store_true",
                    help="listen on all interfaces (tablet over Wi-Fi)")
    ap.add_argument("--demo", action="store_true", help="fake data")
    a = ap.parse_args()

    CONFIG = load_config()
    DEMO = a.demo or CONFIG.get("demo", False)
    port = a.port or CONFIG.get("port", 8765)
    bind = "0.0.0.0" if a.lan else "127.0.0.1"

    if a.command == "check":
        sys.exit(cmd_check())
    if a.command == "setup-esi":
        sys.exit(cmd_setup_esi())
    if a.command == "add-calendar":
        sys.exit(cmd_add_calendar())

    if a.command == "run":
        if adb_path():
            threading.Thread(target=watch_tablet, args=(port,), daemon=True).start()
        else:
            log("adb not found - serving only. Install platform-tools to "
                "drive the tablet over USB.")
    try:
        serve(port, bind)
    except KeyboardInterrupt:
        log("bye")


if __name__ == "__main__":
    main()
