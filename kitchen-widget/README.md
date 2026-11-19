# Kitchen Board: a Samsung tab as a kitchen dashboard

Turns a Galaxy Tab plugged into your computer by USB into an always-on kitchen screen:

- **Clock & date**: big enough to read from the hob, plus sunrise and sunset
- **Weather**: now, the next 12 hours, the next 5 days, feels-like, wind, UV, outdoor air quality (free Open-Meteo, no API key)
- **Smart meter**: live watts, kWh today and yesterday, cost today, gas (Home Assistant or Octopus Energy)
- **Indoor climate**: room temperature, humidity and CO₂ from any Home Assistant sensor
- **Kitchen timers**: tap +1/+5/+10/+30 min, run several at once, full-screen alarm with a beep
- **Tablet status**: model, battery, charging
- Dims at night, keeps the screen awake, and works in landscape and portrait

`tab_agent.py` runs on the computer. It finds the tablet with `adb`, sets `adb reverse` so the tab opens `http://localhost:8765`, keeps the screen on while charging, opens the dashboard, and sets everything up again whenever the cable is re-plugged.

## 1. One-time tablet setup

1. On the tab: **Settings › About tablet › Software information**, tap **Build number** 7 times.
2. **Settings › Developer options › USB debugging** → ON.
3. Plug it in. When "Allow USB debugging?" appears, tick **Always allow** and tap **Allow**.
4. Optional: remove the lock-screen PIN, so the agent can wake the screen straight onto the dashboard.

## 2. On the computer

Install adb. The easiest way, which needs no Homebrew or git, is Google's download:

```bash
curl -L -o ~/platform-tools.zip https://dl.google.com/android/repository/platform-tools-latest-darwin.zip && unzip -o ~/platform-tools.zip -d ~ && xattr -dr com.apple.quarantine ~/platform-tools
```

The agent finds `~/platform-tools/adb` by itself. With a working Homebrew, `brew install android-platform-tools` also works. Then:

```bash
cd kitchen-widget
cp config.example.json config.json   # set your location, meter and sensors
python3 tab_agent.py check            # shows the tab's model, Android version, screen and battery
python3 tab_agent.py run              # serves the board and pushes it to the tab
```

Tap the screen once to go full screen and allow the timer sound. For a true kiosk, use Chrome's **⋮ › Add to Home screen** (opens full screen), or set `"browser": "fully"` if you use Fully Kiosk Browser.

To try it without the tab: `python3 tab_agent.py serve --demo`, then open http://localhost:8765.

**Over Wi-Fi instead of USB:** `python3 tab_agent.py run --lan`, then open `http://<computer-ip>:8765` on the tab. The screen wake lock needs localhost or HTTPS, so USB keeps the screen on more reliably.

## 3. Smart meter

Set `meter.source` in `config.json`:

| source | what you need |
|---|---|
| `homeassistant` | `homeassistant.url` and a long-lived token (HA › Profile › Security). Fill in your sensor entity IDs under `meter.entities`. This works with Glow/Hildebrand CAD, Shelly EM, P1 readers, Hildebrand MQTT, Octopus Home Mini via the HA integration, and similar. |
| `octopus` | Octopus Energy API key, MPAN and meter serial (from octopus.energy › Account › Personal details › API access). Data is about 24 hours behind; for live readings, use an Octopus Home Mini through Home Assistant. |
| `eon` | **E.ON Next** customers: an API key (`sk_live_…`) under `meter.eon.api_key` (see *E.ON API key* below). Shows kWh per day for electricity and gas, cost per day, and the meter reading. E.ON has no official API; this uses the same Kraken API as the E.ON Next website. E.ON's data arrives **3–5 days late**, and there are no live watts. |
| `none` | the tile shows "No smart meter set up" |

Set `price_per_kwh` and `standing_charge_per_day` to get a cost figure. These are on your E.ON bill or in the app under *Tariff*.

### E.ON API key

Since October 2026, E.ON Next signs customers in through Auth0, and the API no longer accepts an email and password. Instead you create an API key once:

1. Open https://www.eonnext.com in **Chrome** and sign in.
2. Open **View › Developer › JavaScript Console**.
3. Paste the contents of `eon_api_key_snippet.js` and press Enter. If Chrome asks, type `allow pasting` first.
4. It prints "Key copied to the clipboard". Save the key in your password manager too.
5. Add the key to the board:

```bash
python3 -c "import json,getpass; c=json.load(open('config.json')); c['meter']['source']='eon'; c['meter'].setdefault('eon',{})['api_key']=getpass.getpass('Paste E.ON API key (hidden): ').strip(); c['meter']['eon'].pop('password',None); c['meter']['eon'].pop('email',None); json.dump(c,open('config.json','w'),indent=2); print('Saved')"
```

E.ON allows **one key per account**. The snippet only creates a key if your account has none, so it won't break another app that already uses one. Another way to create the key is the browser helper in [savagelands-net/homeassistant-eon-next](https://github.com/savagelands-net/homeassistant-eon-next#getting-an-api-key).

**Live watts with E.ON:** E.ON smart meters (SMETS2) send data only about once a day. For a live "W now" figure, add one of these, then use `homeassistant` as the source:
- a **Hildebrand Glow display / CAD** (about £70), which reads the meter's home network every 10 seconds and feeds Home Assistant over local MQTT
- the free **Glow Bright** app (Hildebrand), which links to your meter through the DCC and gives 30-minute data in Home Assistant through a Hildebrand Glow integration (search "Glow" in HACS)

## 4. Indoor temperature

**ESi Wi-Fi thermostat (ESi Centro app):** run `python3 tab_agent.py setup-esi`. Log in with the same email and password you use for the ESi Centro app. It lists your thermostats, saves the one you pick, and the Indoors tile then shows the room temperature and what the heating is set to. ESi has no official API; this uses the same calls as the ESi Centro app (as in the community `pyesicentro` library), and the board checks it every 2 minutes.


The tablet has no room-temperature sensor; its battery temperature is not room temperature. Set `indoor.source` to `homeassistant` and point `indoor.entities.temperature` / `humidity` / `co2` at any HA sensor, such as a cheap Zigbee or Bluetooth thermometer in the kitchen.

## 5. Calendar, news and weather alerts

**Calendar:** today's and tomorrow's events appear under the clock. Add a calendar with:

```bash
python3 tab_agent.py add-calendar
```

Paste its private iCal link:
- **Google:** calendar.google.com › ⚙ Settings › click your calendar › *Integrate calendar* › **Secret address in iCal format**
- **iCloud:** Calendar app › right-click the calendar › Share › tick **Public Calendar** › copy the link

Run it again to add more calendars, such as a partner's or a family calendar. Keep the link private: anyone with it can read the calendar.

**Ticker:** the bottom line rotates through weather alerts and BBC News headlines. The alerts are worked out from the forecast: rain starting or stopping soon, frost overnight, strong gusts, high UV, heat, rain very likely, and high pollen. They are **not** official Met Office warnings. To switch headlines off, set `"news": {"enabled": false}` in `config.json`.

## 6. Night photo frame

Put photos in **`~/Pictures/Kitchen Board`** on the Mac. The agent creates the folder the first time it runs, and subfolders work too. The board fades to a slideshow:

- from **21:00 to 07:00**, dimmed a little, and
- during the day after **10 minutes** without anyone touching the tablet.

The clock, date and outside temperature stay in the corner. Tap anywhere to get back to the board. The slideshow never starts while a kitchen timer is running, and it gets out of the way when a timer rings.

The Mac's built-in `sips` tool shrinks photos to 1280 px and converts iPhone HEIC photos to JPEG, so the old tablet stays quick. Change the times, idle minutes, seconds per photo or folder under `photos` in `config.json`. Set `"enabled": false` to switch it off.

## Files

- `tab_agent.py`: USB agent, web server and data proxy (Python 3.8+, standard library only)
- `config.example.json`: copy it to `config.json`. `config.json` is git-ignored because it holds your tokens
- `web/`: the dashboard (plain HTML/CSS/JS, nothing to build)
