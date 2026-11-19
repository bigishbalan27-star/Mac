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
    args = ["shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", url]
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
        if hit:  # serve stale rather than nothing
            stale = dict(hit[1])
            stale["stale"] = True
            return stale
        return {"error": str(e)}
    with _cache_lock:
        _cache[key] = (now, val)
    return val


def get_weather():
    loc = CONFIG.get("location", {})
    if DEMO:
        return demo_weather()
    q = urllib.parse.urlencode({
        "latitude": loc.get("latitude"),
        "longitude": loc.get("longitude"),
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,"
                   "weather_code,wind_speed_10m,precipitation,is_day",
        "hourly": "temperature_2m,weather_code,precipitation_probability",
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
                "current": "european_aqi,pm2_5",
            }))
        w["air_quality"] = aq.get("current", {})
    except Exception:
        pass
    w["place"] = loc.get("name", "")
    return w


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

_EON_LOGIN = ("mutation loginEmailAuthentication($input: ObtainJSONWebTokenInput!) "
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
        if auth and e.code in (400, 401):
            _eon["token"] = None  # force a fresh login next time
        raise RuntimeError(f"E.ON HTTP {e.code}: {msg}")
    if res.get("errors") and not res.get("data"):
        raise RuntimeError("E.ON: " + res["errors"][0].get("message", "error"))
    return res.get("data") or {}


def eon_token():
    now = time.time()
    if _eon["token"] and _eon["exp"] - 60 > now:
        return _eon["token"]
    cfg = CONFIG.get("meter", {}).get("eon", {})
    if _eon["refresh"] and _eon["refresh_exp"] > now:
        inp = {"refreshToken": _eon["refresh"]}
    else:
        if not cfg.get("email") or not cfg.get("password"):
            raise RuntimeError("set meter.eon.email and password in config.json")
        inp = {"email": cfg["email"], "password": cfg["password"]}
    d = eon_gql(_EON_LOGIN, {"input": inp}, auth=False).get("obtainKrakenToken")
    if not d or not d.get("token"):
        _eon["refresh"] = None
        raise RuntimeError("E.ON login failed - check email/password")
    _eon.update(token=d["token"], exp=d["payload"]["exp"],
                refresh=d["refreshToken"], refresh_exp=d["refreshExpiresIn"])
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


def get_indoor():
    i = CONFIG.get("indoor", {})
    if DEMO:
        return {"temperature": 21.4, "humidity": 48, "source": "demo"}
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
            return self.send_json(cached("meter", ttl.get("meter", 10), get_meter))
        if path == "/api/indoor":
            return self.send_json(cached("indoor", ttl.get("indoor", 30), get_indoor))
        if path == "/api/device":
            return self.send_json(dict(_device_state))
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
    ap.add_argument("command", choices=["check", "run", "serve"], nargs="?",
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
