"""Ring doorbell / camera bridge for the Kitchen Board.

Optional: needs the community `ring_doorbell` library (the one Home
Assistant's Ring integration uses):  python3 -m pip install ring_doorbell
Ring has no official public API, so this can break if Ring changes theirs.

It runs in its own thread with its own asyncio loop:
  * logs in with the saved token (made by `tab_agent.py setup-ring`)
  * listens for Ring push notifications (doorbell press, motion)
  * grabs a snapshot after each event, and on request (rate limited)
The web server reads `STATE` and `snapshot()`.
"""

import asyncio
import json
import os
import threading
import time

HERE = os.path.dirname(os.path.abspath(__file__))
TOKEN_PATH = os.path.join(HERE, "ring_token.json")
FCM_PATH = os.path.join(HERE, "ring_push.json")
USER_AGENT = "KitchenBoard/1.0"

STATE = {"enabled": False, "status": "off", "error": None, "events": [],
         "devices": [], "snapshot_at": 0, "snapshot_device": None}
_lock = threading.Lock()
_snap = {"bytes": None}
_ctl = {"loop": None, "want_snapshot": 0.0, "last_snapshot_req": 0.0}


def available():
    try:
        import ring_doorbell  # noqa: F401
        return True
    except ImportError:
        return False


def _save_json(path, data):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f)
    os.replace(tmp, path)
    try:
        os.chmod(path, 0o600)
    except OSError:
        pass


def _load_json(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def snapshot():
    with _lock:
        return _snap["bytes"]


def request_snapshot():
    """Ask for a fresh snapshot (at most once a minute to spare batteries)."""
    now = time.time()
    if now - _ctl["last_snapshot_req"] < 60:
        return False
    _ctl["last_snapshot_req"] = now
    _ctl["want_snapshot"] = now
    return True


def _add_event(kind, device, at=None):
    with _lock:
        STATE["events"].insert(0, {"kind": kind, "device": device, "at": at or time.time()})
        del STATE["events"][20:]


def start(cfg, log):
    """Start the bridge thread if Ring is set up. cfg = CONFIG['ring']."""
    if not cfg or not cfg.get("enabled", True):
        return
    if not os.path.exists(TOKEN_PATH):
        return
    if not available():
        STATE.update(status="error", error="ring_doorbell not installed - run: python3 -m pip install ring_doorbell")
        log("Ring: " + STATE["error"])
        return
    STATE["enabled"] = True
    t = threading.Thread(target=lambda: asyncio.run(_main(cfg, log)), daemon=True)
    t.start()


async def _main(cfg, log):
    from ring_doorbell import Auth, Ring
    wanted = [n.strip().lower() for n in cfg.get("devices") or [] if n]
    while True:
        auth = None
        try:
            STATE.update(status="connecting", error=None)
            auth = Auth(USER_AGENT, _load_json(TOKEN_PATH), lambda tok: _save_json(TOKEN_PATH, tok))
            ring = Ring(auth)
            await ring.async_create_session()
            await ring.async_update_data()
            devs = [d for d in ring.video_devices()
                    if not wanted or str(d.name).strip().lower() in wanted]
            if not devs:
                raise RuntimeError("no Ring cameras/doorbells found on this account")
            by_id = {d.id: d for d in devs}
            STATE["devices"] = [d.name for d in devs]
            log("Ring: connected - " + ", ".join(STATE["devices"]))

            async def grab(dev):
                try:
                    img = await dev.async_get_snapshot(retries=4, delay=2)
                    if img:
                        with _lock:
                            _snap["bytes"] = img
                        STATE.update(snapshot_at=time.time(), snapshot_device=dev.name)
                except Exception as e:  # snapshot not supported / camera asleep
                    log(f"Ring: snapshot failed for {dev.name}: {e}")

            loop = asyncio.get_running_loop()
            listener_ok = False
            try:
                from ring_doorbell import RingEventListener

                def on_event(ev):
                    dev = by_id.get(ev.doorbot_id)
                    if dev is None:
                        return
                    if getattr(ev, "is_update", False):
                        return
                    _add_event(ev.kind, dev.name, ev.now)
                    log(f"Ring: {ev.kind} at {dev.name}")
                    if ev.kind in ("ding", "motion"):
                        loop.call_soon_threadsafe(lambda: asyncio.ensure_future(grab(dev)))

                listener = RingEventListener(ring, _load_json(FCM_PATH),
                                             lambda c: _save_json(FCM_PATH, c))
                listener.add_notification_callback(on_event)
                listener_ok = await listener.start()
            except Exception as e:
                log(f"Ring: push listener unavailable ({e}); checking history every minute")
            STATE.update(status="live" if listener_ok else "polling")

            # first snapshot so the camera button has something to show
            await grab(devs[0])
            seen = set()
            last_poll = 0.0
            while True:
                await asyncio.sleep(2)
                if _ctl["want_snapshot"]:
                    _ctl["want_snapshot"] = 0
                    await grab(devs[0])
                if not listener_ok and time.time() - last_poll > 60:
                    last_poll = time.time()
                    for dev in devs:
                        for h in await dev.async_history(limit=3):
                            key = h.get("id")
                            if key in seen:
                                continue
                            seen.add(key)
                            created = h.get("created_at")
                            at = created.timestamp() if hasattr(created, "timestamp") else time.time()
                            if last_poll - at < 180:  # only fresh events
                                _add_event(h.get("kind", "motion"), dev.name, at)
                                await grab(dev)
        except Exception as e:
            msg = str(e) or e.__class__.__name__
            if "AuthenticationError" in e.__class__.__name__ or "Requires2FA" in e.__class__.__name__:
                msg = "Ring login expired - run: python3 tab_agent.py setup-ring"
            STATE.update(status="error", error=msg[:200])
            log("Ring: " + msg[:200])
        finally:
            if auth is not None:
                try:
                    await auth.async_close()
                except Exception:
                    pass
        await asyncio.sleep(120)  # retry later


def setup_interactive(config_path, example_path):
    """`tab_agent.py setup-ring`: log in (with 2-step code), pick cameras, save."""
    import getpass
    if not available():
        print("First install the Ring library on this Mac:\n  python3 -m pip install ring_doorbell")
        return 1
    from ring_doorbell import Auth, Ring
    from ring_doorbell.exceptions import Requires2FAError, AuthenticationError

    async def go():
        email = input("Ring email: ").strip()
        password = getpass.getpass("Ring password (hidden): ")
        auth = Auth(USER_AGENT, None, lambda tok: _save_json(TOKEN_PATH, tok))
        try:
            try:
                await auth.async_fetch_token(email, password)
            except Requires2FAError:
                code = input("Ring sent you a verification code - enter it: ").strip()
                await auth.async_fetch_token(email, password, code)
            ring = Ring(auth)
            await ring.async_create_session()
            await ring.async_update_data()
            devs = list(ring.video_devices())
        except AuthenticationError:
            print("Ring rejected the email, password or code. Try again.")
            return 1
        finally:
            await auth.async_close()
        if not devs:
            print("Logged in, but no doorbells or cameras on this account.")
            return 1
        for n, d in enumerate(devs, 1):
            print(f"  {n}. {d.name} ({d.family})")
        picks = devs
        if len(devs) > 1:
            a = input("Which to use? e.g. 1  or  1,2  (Enter = all): ").strip()
            nums = [int(x) for x in a.replace(" ", "").split(",") if x.isdigit() and 1 <= int(x) <= len(devs)]
            if nums:
                picks = [devs[i - 1] for i in dict.fromkeys(nums)]
        path = config_path if os.path.exists(config_path) else example_path
        with open(path, encoding="utf-8") as f:
            cfg = json.load(f)
        cfg["ring"] = {"enabled": True, "devices": [d.name for d in picks]}
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(cfg, f, indent=2)
        print("Saved (your password is not stored - only Ring's login token). "
              "Restart the board: python3 tab_agent.py run")
        return 0

    return asyncio.run(go())
