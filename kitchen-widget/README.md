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

Install adb (macOS: `brew install android-platform-tools`), then:

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
| `eon` | **E.ON Next** customers: your E.ON Next login email and password under `meter.eon` (optionally your account number). Shows kWh per day for electricity and gas, cost per day, and the meter reading. E.ON has no official API; this uses the same API as the E.ON Next website (as in the community [eon-next](https://github.com/madmachinations/eon-next) Home Assistant integration), so it could break if E.ON changes it. Smart meters send readings about once a day, so there are no live watts. |
| `none` | the tile shows "No smart meter set up" |

Set `price_per_kwh` and `standing_charge_per_day` to get a cost figure. These are on your E.ON bill or in the app under *Tariff*.

**Live watts with E.ON:** E.ON smart meters (SMETS2) send data only about once a day. For a live "W now" figure, add one of these, then use `homeassistant` as the source:
- a **Hildebrand Glow display / CAD** (about £70), which reads the meter's home network every 10 seconds and feeds Home Assistant over local MQTT
- the free **Glow Bright** app (Hildebrand), which links to your meter through the DCC and gives 30-minute data in Home Assistant through a Hildebrand Glow integration (search "Glow" in HACS)

## 4. Indoor temperature

The tablet has no room-temperature sensor; its battery temperature is not room temperature. Set `indoor.source` to `homeassistant` and point `indoor.entities.temperature` / `humidity` / `co2` at any HA sensor, such as a cheap Zigbee or Bluetooth thermometer in the kitchen.

## Files

- `tab_agent.py`: USB agent, web server and data proxy (Python 3.8+, standard library only)
- `config.example.json`: copy it to `config.json`. `config.json` is git-ignored because it holds your tokens
- `web/`: the dashboard (plain HTML/CSS/JS, nothing to build)
