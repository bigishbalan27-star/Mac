/* Kitchen Board - talks to tab_agent.py's /api/* endpoints. */
(() => {
  const $ = (id) => document.getElementById(id);
  let cfg = { clock_24h: true, night_mode: {}, units: {} };

  const WMO = {
    0: ["Clear", "☀️", "🌙"], 1: ["Mostly clear", "🌤️", "🌙"], 2: ["Partly cloudy", "⛅", "☁️"],
    3: ["Overcast", "☁️", "☁️"], 45: ["Fog", "🌫️"], 48: ["Freezing fog", "🌫️"],
    51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Heavy drizzle", "🌧️"],
    56: ["Freezing drizzle", "🌧️"], 57: ["Freezing drizzle", "🌧️"],
    61: ["Light rain", "🌦️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
    66: ["Freezing rain", "🌧️"], 67: ["Freezing rain", "🌧️"],
    71: ["Light snow", "🌨️"], 73: ["Snow", "🌨️"], 75: ["Heavy snow", "❄️"], 77: ["Snow grains", "🌨️"],
    80: ["Showers", "🌦️"], 81: ["Showers", "🌧️"], 82: ["Violent showers", "⛈️"],
    85: ["Snow showers", "🌨️"], 86: ["Snow showers", "❄️"],
    95: ["Thunderstorm", "⛈️"], 96: ["Thunder & hail", "⛈️"], 99: ["Thunder & hail", "⛈️"],
  };
  const wmo = (c, day = 1) => {
    const w = WMO[c] || ["—", "·"];
    return { text: w[0], icon: (!day && w[2]) || w[1] };
  };
  const locale = () => cfg.locale || undefined;
  const fmtTime = (d) => d.toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit", hour12: !cfg.clock_24h });
  const num = (v, d = 0) => (v == null || isNaN(v) ? "--" : Number(v).toFixed(d));

  async function api(path) {
    const r = await fetch(path, { cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }

  /* ---------------- clock ---------------- */
  function tick() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    if (!cfg.clock_24h) {
      $("ampm").textContent = h < 12 ? "AM" : "PM";
      h = h % 12 || 12;
    } else $("ampm").textContent = "";
    $("hm").textContent = `${cfg.clock_24h ? String(h).padStart(2, "0") : h}:${m}`;
    $("sec").textContent = String(now.getSeconds()).padStart(2, "0");
    $("date").textContent = now.toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long" });
    const nm = cfg.night_mode || {};
    if (nm.start != null) {
      const hr = now.getHours();
      const night = nm.start > nm.end ? hr >= nm.start || hr < nm.end : hr >= nm.start && hr < nm.end;
      document.body.classList.toggle("night", night);
    }
    tickTimers();
  }

  /* ---------------- weather ---------------- */
  async function loadWeather() {
    try {
      const w = await api("/api/weather");
      if (w.error) throw new Error(w.error);
      const c = w.current, u = w.current_units || {};
      const deg = (u.temperature_2m || "°").replace("C", "").replace("F", "");
      const now = wmo(c.weather_code, c.is_day);
      $("place").textContent = w.place || "Outside";
      $("wIcon").textContent = now.icon;
      $("wTemp").textContent = `${Math.round(c.temperature_2m)}${deg}`;
      $("wDesc").textContent = now.text + (w.stale ? " (offline)" : "");
      $("wMeta").innerHTML = [
        `Feels ${Math.round(c.apparent_temperature)}°`,
        `💧 ${c.relative_humidity_2m}%`,
        `💨 ${Math.round(c.wind_speed_10m)} ${u.wind_speed_10m || "km/h"}`,
        w.daily ? `UV ${num(w.daily.uv_index_max[0], 0)}` : "",
      ].filter(Boolean).map((s) => `<span>${s}</span>`).join("");

      const aq = w.air_quality && w.air_quality.european_aqi;
      $("aq").textContent = aq != null ? `Air ${aq} · ${aq <= 40 ? "good" : aq <= 60 ? "fair" : aq <= 80 ? "poor" : "bad"}` : "";
      $("aq").hidden = aq == null;

      // next 6 slots, every 2 hours
      const H = w.hourly, nowT = Date.now();
      let start = H.time.findIndex((t) => new Date(t).getTime() > nowT);
      if (start < 0) start = 0;
      let html = "";
      for (let k = 0; k < 6; k++) {
        const i = start + k * 2;
        if (i >= H.time.length) break;
        const t = new Date(H.time[i]);
        const p = H.precipitation_probability ? H.precipitation_probability[i] : null;
        html += `<div><span class="h">${t.toLocaleTimeString(locale(), { hour: "numeric", hour12: !cfg.clock_24h })}</span>` +
          `<span class="i">${wmo(H.weather_code[i], t.getHours() > 6 && t.getHours() < 19).icon}</span>` +
          `<span>${Math.round(H.temperature_2m[i])}°</span><span class="p">${p >= 20 ? p + "%" : ""}</span></div>`;
      }
      $("hours").innerHTML = html;

      const D = w.daily;
      if (D) {
        $("sun").innerHTML = `<span>🌅 ${fmtTime(new Date(D.sunrise[0]))}</span><span>🌇 ${fmtTime(new Date(D.sunset[0]))}</span>`;
        $("days").innerHTML = D.time.map((d, i) => {
          const day = i === 0 ? "Today" : new Date(d + "T12:00").toLocaleDateString(locale(), { weekday: "short" });
          const rain = D.precipitation_probability_max[i];
          return `<li><span class="d">${day}</span><span>${wmo(D.weather_code[i]).icon}</span>` +
            `<span class="rain">${rain >= 20 ? "☔ " + rain + "%" : ""}</span>` +
            `<span>${Math.round(D.temperature_2m_max[i])}° <span class="lo">${Math.round(D.temperature_2m_min[i])}°</span></span></li>`;
        }).join("");
      }
      stamp();
    } catch (e) {
      $("wDesc").textContent = "Weather unavailable";
    }
  }

  /* ---------------- energy ---------------- */
  async function loadMeter() {
    try {
      const m = await api("/api/meter");
      const tile = $("energyTile");
      if (m.source === "none" || m.error) {
        tile.classList.add("off");
        $("meterNote").textContent = m.error ? "Meter: " + m.error : "No smart meter set up - see README";
        return;
      }
      tile.classList.remove("off");
      const live = m.power_w != null;
      // no live watts (e.g. E.ON readings): headline becomes kWh per day
      $("pw").textContent = live ? (m.power_w >= 10000 ? (m.power_w / 1000).toFixed(1) + "k" : Math.round(m.power_w))
        : m.today_kwh != null ? num(m.today_kwh, 1) : "--";
      $("pwUnit").textContent = live ? "W now" : "kWh / day";
      $("kwhLbl").textContent = m.reading_date ? "Meter" : "Today";
      $("ykwhLbl").textContent = m.reading_date ? "Day before" : "Yesterday";
      $("costLbl").textContent = m.reading_date ? "Cost / day" : "Cost";
      $("pwBar").parentElement.hidden = !live;
      $("pwBar").style.width = Math.min(100, (m.power_w || 0) / 50) + "%"; // 5 kW = full
      $("pwBar").style.backgroundPosition = Math.min(100, (m.power_w || 0) / 30) + "% 0";
      $("kwh").textContent = m.reading_date ? Math.round(m.reading) + " kWh"
        : m.today_kwh == null ? "--" : num(m.today_kwh, 1) + " kWh";
      $("ykwh").textContent = m.yesterday_kwh == null ? "--" : num(m.yesterday_kwh, 1) + " kWh";
      $("cost").textContent = m.today_cost == null ? "--" : (m.currency || "") + num(m.today_cost, 2);
      $("gasRow").hidden = m.gas_today_kwh == null;
      $("gas").textContent = num(m.gas_today_kwh, 1) + " kWh";
      $("gasLbl").textContent = m.reading_date ? "Gas / day" : "Gas today";
      $("meterNote").textContent = m.note || (m.stale ? "Meter offline - last reading" : "");
    } catch (e) { /* agent unreachable; status bar shows it */ }
  }

  /* ---------------- indoor ---------------- */
  async function loadIndoor() {
    try {
      const i = await api("/api/indoor");
      const tile = $("indoorTile");
      if (i.source === "none" || i.temperature == null) {
        tile.classList.add("off");
        $("inTemp").textContent = "--";
        $("inNote").textContent = i.source === "none" ? "Add a room sensor - see README" : "Sensor offline";
        return;
      }
      tile.classList.remove("off");
      $("inTemp").textContent = num(i.temperature, 1);
      $("inUnit").textContent = cfg.units.temperature === "fahrenheit" ? "°F" : "°C";
      $("inHum").textContent = i.humidity != null ? `💧 ${Math.round(i.humidity)}%` : "";
      $("inCo2").textContent = i.co2 != null ? `CO₂ ${Math.round(i.co2)} ppm` : "";
      $("inNote").textContent = i.humidity > 65 ? "Humid - open a window or run the hood" : "";
    } catch (e) { }
  }

  /* ---------------- device ---------------- */
  async function loadDevice() {
    try {
      const d = await api("/api/device");
      $("dev").textContent = d.connected
        ? `${d.name || d.model} · 🔋 ${d.battery}%${d.charging ? " ⚡" : ""}`
        : "";
      document.body.dataset.offline = "";
    } catch (e) {
      $("dev").textContent = "Agent offline - showing last data";
    }
  }
  function stamp() {
    $("upd").textContent = "Updated " + fmtTime(new Date());
  }

  /* ---------------- timers ---------------- */
  let timers = [];
  try { timers = JSON.parse(localStorage.getItem("kb_timers") || "[]"); } catch (e) { }
  const save = () => { try { localStorage.setItem("kb_timers", JSON.stringify(timers)); } catch (e) { } };
  const mmss = (s) => {
    s = Math.max(0, Math.ceil(s));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0");
  };
  function renderTimers() {
    const ul = $("timerList");
    if (!timers.length) { ul.innerHTML = '<li class="empty">Tap a button to start a timer</li>'; return; }
    ul.innerHTML = timers.map((t, i) =>
      `<li data-i="${i}"><span class="left">--</span><span class="ctl">` +
      `<button data-plus="${i}">+1m</button><button data-del="${i}">✕</button></span></li>`).join("");
    tickTimers();
  }
  let ringing = null;
  function tickTimers() {
    const now = Date.now();
    document.querySelectorAll("#timerList li[data-i]").forEach((li) => {
      const t = timers[li.dataset.i];
      if (!t) return;
      const left = (t.end - now) / 1000;
      li.querySelector(".left").textContent = left > 0 ? mmss(left) : "Done";
      li.classList.toggle("done", left <= 0);
      if (left <= 0 && !t.rang) { t.rang = true; save(); ring(t); }
    });
  }
  function addTimer(sec) {
    timers.push({ end: Date.now() + sec * 1000, total: sec });
    timers.sort((a, b) => a.end - b.end);
    save(); renderTimers();
  }
  document.querySelector(".t-add").addEventListener("click", (e) => {
    const s = e.target.dataset.add; if (s) { unlockAudio(); addTimer(+s); }
  });
  $("timerList").addEventListener("click", (e) => {
    const p = e.target.dataset.plus, d = e.target.dataset.del;
    if (p != null) { const t = timers[p]; t.end = Math.max(t.end, Date.now()) + 60000; t.rang = false; }
    if (d != null) timers.splice(d, 1);
    save(); renderTimers();
  });

  let actx;
  function unlockAudio() {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch (e) { }
  }
  let beepTimer;
  function ring(t) {
    $("alarmText").textContent = `${mmss(t.total)} timer done`;
    $("alarm").hidden = false;
    clearInterval(beepTimer);
    const beep = () => {
      if (!actx) return;
      [0, .25, .5].forEach((dt) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(actx.destination);
        g.gain.setValueAtTime(.4, actx.currentTime + dt);
        g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + dt + .2);
        o.start(actx.currentTime + dt); o.stop(actx.currentTime + dt + .2);
      });
    };
    beep(); beepTimer = setInterval(beep, 1500);
    if (navigator.vibrate) navigator.vibrate([400, 200, 400]);
    ringing = setTimeout(stopAlarm, 120000);
  }
  function stopAlarm() {
    clearInterval(beepTimer); clearTimeout(ringing);
    $("alarm").hidden = true;
    timers = timers.filter((t) => t.end > Date.now());
    save(); renderTimers();
  }
  $("alarmStop").addEventListener("click", stopAlarm);

  /* ---------------- kiosk bits ---------------- */
  let wakeLock;
  async function keepAwake() {
    try { if ("wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen"); } catch (e) { }
  }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") keepAwake(); });
  // first tap anywhere: go fullscreen + allow timer sound
  document.addEventListener("click", () => {
    unlockAudio();
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(() => { });
  }, { once: true });
  // reload once a day at ~3am to pick up any changes and free memory
  setInterval(() => { const n = new Date(); if (n.getHours() === 3 && n.getMinutes() === 0 && n.getSeconds() < 2) location.reload(); }, 1000);

  /* ---------------- start ---------------- */
  (async () => {
    try { cfg = Object.assign(cfg, await api("/api/config")); } catch (e) { }
    document.title = (cfg.title || "Kitchen") + " Board";
    tick(); setInterval(tick, 1000);
    renderTimers();
    keepAwake();
    loadWeather(); setInterval(loadWeather, 10 * 60 * 1000);
    loadMeter(); setInterval(loadMeter, 10 * 1000);
    loadIndoor(); setInterval(loadIndoor, 30 * 1000);
    loadDevice(); setInterval(loadDevice, 30 * 1000);
  })();
})();
