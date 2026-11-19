/* Kitchen Board - talks to tab_agent.py's /api/* endpoints.
   Written in plain ES5 (no arrow functions, async, fetch, template strings,
   padStart...) so it also runs on old tablets such as a Galaxy Tab A 7.0 with
   Android 5 and its original Chrome. */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }
  var cfg = { clock_24h: true, night_mode: {}, units: {} };

  var WMO = {
    0: ["Clear", "☀️", "🌙"], 1: ["Mostly clear", "🌤️", "🌙"],
    2: ["Partly cloudy", "⛅", "☁️"], 3: ["Overcast", "☁️", "☁️"],
    45: ["Fog", "🌫️"], 48: ["Freezing fog", "🌫️"],
    51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Heavy drizzle", "🌧️"],
    56: ["Freezing drizzle", "🌧️"], 57: ["Freezing drizzle", "🌧️"],
    61: ["Light rain", "🌦️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
    66: ["Freezing rain", "🌧️"], 67: ["Freezing rain", "🌧️"],
    71: ["Light snow", "🌨️"], 73: ["Snow", "🌨️"], 75: ["Heavy snow", "❄️"], 77: ["Snow grains", "🌨️"],
    80: ["Showers", "🌦️"], 81: ["Showers", "🌧️"], 82: ["Violent showers", "⛈️"],
    85: ["Snow showers", "🌨️"], 86: ["Snow showers", "❄️"],
    95: ["Thunderstorm", "⛈️"], 96: ["Thunder & hail", "⛈️"], 99: ["Thunder & hail", "⛈️"]
  };
  function wmo(c, day) {
    if (day === undefined) day = 1;
    var w = WMO[c] || ["—", "·"];
    return { text: w[0], icon: (!day && w[2]) || w[1] };
  }
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  function pad(n) { n = String(n); return n.length < 2 ? "0" + n : n; }
  function fmtTime(d) {
    var h = d.getHours(), m = pad(d.getMinutes());
    if (cfg.clock_24h) return pad(h) + ":" + m;
    return (h % 12 || 12) + ":" + m + (h < 12 ? " am" : " pm");
  }
  function fmtHour(d) {
    var h = d.getHours();
    return cfg.clock_24h ? pad(h) : (h % 12 || 12) + (h < 12 ? "a" : "p");
  }
  // "2026-11-19T07:31" -> local Date (old browsers parse ISO without zone as UTC)
  function parseLocal(s) {
    var p = s.split(/[-T:]/);
    return new Date(+p[0], +p[1] - 1, +p[2], +(p[3] || 0), +(p[4] || 0));
  }
  function num(v, d) {
    if (v === null || v === undefined || isNaN(v)) return "--";
    return Number(v).toFixed(d || 0);
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function api(path, ok, bad) {
    var x = new XMLHttpRequest();
    x.open("GET", path + (path.indexOf("?") < 0 ? "?" : "&") + "t=" + Date.now(), true);
    x.timeout = 20000;
    x.onload = function () {
      if (x.status !== 200) { if (bad) bad(); return; }
      var j; try { j = JSON.parse(x.responseText); } catch (e) { if (bad) bad(); return; }
      ok(j);
    };
    x.onerror = x.ontimeout = function () { if (bad) bad(); };
    x.send();
  }

  /* ---------------- clock ---------------- */
  function tick() {
    var now = new Date(), h = now.getHours();
    if (!cfg.clock_24h) { $("ampm").textContent = h < 12 ? "AM" : "PM"; h = h % 12 || 12; }
    else $("ampm").textContent = "";
    $("hm").textContent = (cfg.clock_24h ? pad(h) : h) + ":" + pad(now.getMinutes());
    $("sec").textContent = pad(now.getSeconds());
    $("date").textContent = DAYS[now.getDay()] + " " + now.getDate() + " " + MONTHS[now.getMonth()];
    var nm = cfg.night_mode || {};
    if (nm.start !== undefined && nm.start !== null) {
      var hr = now.getHours();
      var night = nm.start > nm.end ? (hr >= nm.start || hr < nm.end) : (hr >= nm.start && hr < nm.end);
      if (night) document.body.classList.add("night"); else document.body.classList.remove("night");
    }
    tickTimers();
  }

  /* ---------------- weather ---------------- */
  function loadWeather() {
    api("/api/weather", function (w) {
      if (w.error) { $("wDesc").textContent = "Weather unavailable"; return; }
      var c = w.current, u = w.current_units || {};
      var now = wmo(c.weather_code, c.is_day);
      $("place").textContent = w.place || "Outside";
      $("wIcon").textContent = now.icon;
      $("wTemp").textContent = Math.round(c.temperature_2m) + "°";
      $("wDesc").textContent = now.text + (w.stale ? " (offline)" : "");
      var meta = ["Feels " + Math.round(c.apparent_temperature) + "°",
        "💧 " + c.relative_humidity_2m + "%",
        "💨 " + Math.round(c.wind_speed_10m) + " " + (u.wind_speed_10m || "km/h")];
      if (w.daily) meta.push("UV " + num(w.daily.uv_index_max[0], 0));
      $("wMeta").innerHTML = meta.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("");

      var aq = w.air_quality && w.air_quality.european_aqi;
      if (aq !== undefined && aq !== null) {
        $("aq").textContent = "Air " + aq + " · " + (aq <= 40 ? "good" : aq <= 60 ? "fair" : aq <= 80 ? "poor" : "bad");
        $("aq").hidden = false;
      } else $("aq").hidden = true;

      var H = w.hourly, nowT = Date.now(), start = 0, i, k, html = "";
      for (i = 0; i < H.time.length; i++) { if (parseLocal(H.time[i]).getTime() > nowT) { start = i; break; } }
      for (k = 0; k < 6; k++) {
        i = start + k * 2;
        if (i >= H.time.length) break;
        var t = parseLocal(H.time[i]);
        var p = H.precipitation_probability ? H.precipitation_probability[i] : null;
        html += '<div><span class="h">' + fmtHour(t) + '</span>' +
          '<span class="i">' + wmo(H.weather_code[i], t.getHours() > 6 && t.getHours() < 19).icon + '</span>' +
          '<span>' + Math.round(H.temperature_2m[i]) + '°</span><span class="p">' + (p >= 20 ? p + "%" : "") + '</span></div>';
      }
      $("hours").innerHTML = html;
      alerts = w.alerts || [];

      var D = w.daily;
      if (D) {
        $("sun").innerHTML = "<span>🌅 " + fmtTime(parseLocal(D.sunrise[0])) + "</span><span>🌇 " + fmtTime(parseLocal(D.sunset[0])) + "</span>";
        var rows = "";
        for (i = 0; i < D.time.length; i++) {
          var day = i === 0 ? "Today" : DAYS[parseLocal(D.time[i]).getDay()].slice(0, 3);
          var rain = D.precipitation_probability_max[i];
          rows += '<li><span class="d">' + day + '</span><span>' + wmo(D.weather_code[i]).icon + '</span>' +
            '<span class="rain">' + (rain >= 20 ? "☔ " + rain + "%" : "") + '</span>' +
            '<span>' + Math.round(D.temperature_2m_max[i]) + '° <span class="lo">' + Math.round(D.temperature_2m_min[i]) + '°</span></span></li>';
        }
        $("days").innerHTML = rows;
      }
      stamp();
    }, function () { $("wDesc").textContent = "Weather unavailable"; });
  }

  /* ---------------- energy ---------------- */
  function loadMeter() {
    api("/api/meter", function (m) {
      var tile = $("energyTile");
      if (m.source === "none" || m.error) {
        tile.classList.add("off");
        $("meterNote").textContent = m.error ? "Meter: " + m.error : "No smart meter set up";
        return;
      }
      tile.classList.remove("off");
      var live = m.power_w !== null && m.power_w !== undefined;
      $("pw").textContent = live ? (m.power_w >= 10000 ? (m.power_w / 1000).toFixed(1) + "k" : Math.round(m.power_w))
        : (m.today_kwh !== null && m.today_kwh !== undefined ? num(m.today_kwh, 1) : "--");
      $("pwUnit").textContent = live ? "W now" : "kWh / day";
      $("kwhLbl").textContent = m.reading_date ? "Meter" : "Today";
      $("ykwhLbl").textContent = m.reading_date ? "Day before" : "Yesterday";
      $("costLbl").textContent = m.reading_date ? "Cost / day" : "Cost";
      $("pwBar").parentNode.hidden = !live;
      $("pwBar").style.width = Math.min(100, (m.power_w || 0) / 50) + "%"; // 5 kW = full
      $("kwh").textContent = m.reading_date ? Math.round(m.reading) + " kWh"
        : (m.today_kwh === null || m.today_kwh === undefined ? "--" : num(m.today_kwh, 1) + " kWh");
      $("ykwh").textContent = m.yesterday_kwh === null || m.yesterday_kwh === undefined ? "--" : num(m.yesterday_kwh, 1) + " kWh";
      $("cost").textContent = m.today_cost === null || m.today_cost === undefined ? "--" : (m.currency || "") + num(m.today_cost, 2);
      $("gasRow").hidden = m.gas_today_kwh === null || m.gas_today_kwh === undefined;
      $("gas").textContent = num(m.gas_today_kwh, 1) + " kWh";
      $("gasLbl").textContent = m.reading_date ? "Gas / day" : "Gas today";
      $("meterNote").textContent = m.note || (m.stale ? "Meter offline - last reading" : "");
    });
  }

  /* ---------------- indoor ---------------- */
  function loadIndoor() {
    api("/api/indoor", function (i) {
      var tile = $("indoorTile");
      if (i.source === "none" || i.temperature === null || i.temperature === undefined) {
        tile.classList.add("off");
        $("inTemp").textContent = "--";
        $("inNote").textContent = i.source === "none" ? "Add a room sensor - see README" : "Sensor offline";
        return;
      }
      tile.classList.remove("off");
      $("inTemp").textContent = num(i.temperature, 1);
      $("inUnit").textContent = cfg.units.temperature === "fahrenheit" ? "°F" : "°C";
      $("inHum").textContent = i.humidity !== null && i.humidity !== undefined ? "💧 " + Math.round(i.humidity) + "%" : "";
      $("inCo2").textContent = i.co2 !== null && i.co2 !== undefined ? "CO₂ " + Math.round(i.co2) + " ppm"
        : (i.target !== null && i.target !== undefined ? "Heating set to " + num(i.target, 1) + "°" : "");
      $("inNote").textContent = i.humidity > 65 ? "Humid - open a window or run the hood"
        : (i.source === "esi" ? (i.name || "ESi thermostat") + (i.online === false || i.online === "0" ? " (offline)" : "") : "");
    });
  }

  /* ---------------- device ---------------- */
  function loadDevice() {
    api("/api/device", function (d) {
      $("dev").textContent = d.connected
        ? (d.name || d.model) + " · 🔋 " + d.battery + "%" + (d.charging ? " ⚡" : "")
        : "";
    }, function () { $("dev").textContent = "Agent offline - showing last data"; });
  }
  function stamp() { $("upd").textContent = "Updated " + fmtTime(new Date()); }

  /* ---------------- calendar ---------------- */
  function loadCalendar() {
    api("/api/calendar", function (c) {
      var ul = $("cal");
      if (c.error) { ul.innerHTML = '<li class="empty">Calendar unavailable</li>'; return; }
      if (c.source === "none") { ul.innerHTML = ""; $("clockTile").classList.remove("has-cal"); return; }
      var ev = c.events || [];
      if (ev.length) $("clockTile").classList.add("has-cal"); else $("clockTile").classList.remove("has-cal");
      if (!ev.length) { ul.innerHTML = '<li class="empty">Nothing on today or tomorrow</li>'; return; }
      var html = "", last = "";
      for (var i = 0; i < ev.length && i < 3; i++) {
        var e = ev[i];
        html += '<li class="' + (e.day === "Today" ? "today" : "tomorrow") + '">' +
          '<span class="cd">' + (e.day !== last ? esc(e.day) : "") + '</span>' +
          '<span class="ct">' + (e.time ? esc(e.time) : "all day") + '</span>' +
          '<span class="cx">' + esc(e.title) + '</span></li>';
        last = e.day;
      }
      ul.innerHTML = html;
    });
  }

  /* ---------------- ticker: weather alerts + headlines ---------------- */
  var alerts = [], headlines = [], tickPos = 0;
  function loadNews() {
    api("/api/news", function (n) { headlines = (n && n.headlines) || []; });
  }
  function nextTicker() {
    var items = [], i;
    for (i = 0; i < alerts.length; i++) items.push(alerts[i]);
    // weave headlines in after the alerts
    for (i = 0; i < headlines.length; i++) items.push({ level: "news", text: "\uD83D\uDCF0 " + headlines[i] });
    var el = $("ticker");
    if (!items.length) { el.textContent = ""; return; }
    if (tickPos >= items.length) tickPos = 0;
    var it = items[tickPos++];
    el.className = "fade";
    setTimeout(function () {
      el.textContent = it.text;
      el.className = it.level === "warn" ? "warn" : "";
    }, 400);
  }

  /* ---------------- timers ---------------- */
  var timers = [];
  try { timers = JSON.parse(localStorage.getItem("kb_timers") || "[]"); } catch (e) { }
  function save() { try { localStorage.setItem("kb_timers", JSON.stringify(timers)); } catch (e) { } }
  function mmss(s) {
    s = Math.max(0, Math.ceil(s));
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return (h ? h + ":" + pad(m) : m) + ":" + pad(x);
  }
  function renderTimers() {
    var ul = $("timerList");
    if (!timers.length) { ul.innerHTML = '<li class="empty">Tap a button to start a timer</li>'; return; }
    ul.innerHTML = timers.map(function (t, i) {
      return '<li data-i="' + i + '"><span class="left">--</span><span class="ctl">' +
        '<button data-plus="' + i + '">+1m</button><button data-del="' + i + '">✕</button></span></li>';
    }).join("");
    tickTimers();
  }
  function tickTimers() {
    var now = Date.now(), lis = document.querySelectorAll("#timerList li[data-i]");
    for (var n = 0; n < lis.length; n++) {
      var li = lis[n], t = timers[li.getAttribute("data-i")];
      if (!t) continue;
      var left = (t.end - now) / 1000;
      li.querySelector(".left").textContent = left > 0 ? mmss(left) : "Done";
      if (left <= 0) li.classList.add("done"); else li.classList.remove("done");
      if (left <= 0 && !t.rang) { t.rang = true; save(); ring(t); }
    }
  }
  function addTimer(sec) {
    timers.push({ end: Date.now() + sec * 1000, total: sec });
    timers.sort(function (a, b) { return a.end - b.end; });
    save(); renderTimers();
  }
  document.querySelector(".t-add").addEventListener("click", function (e) {
    var s = e.target.getAttribute("data-add");
    if (s) { unlockAudio(); addTimer(+s); }
  });
  $("timerList").addEventListener("click", function (e) {
    var p = e.target.getAttribute("data-plus"), d = e.target.getAttribute("data-del");
    if (p !== null) { var t = timers[p]; t.end = Math.max(t.end, Date.now()) + 60000; t.rang = false; }
    if (d !== null) timers.splice(+d, 1);
    save(); renderTimers();
  });

  var actx = null, beepTimer = null, ringing = null;
  function unlockAudio() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!actx && AC) actx = new AC();
      if (actx && actx.resume) actx.resume();
    } catch (e) { }
  }
  function beep() {
    if (!actx) return;
    [0, 0.25, 0.5].forEach(function (dt) {
      var o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(actx.destination);
      g.gain.setValueAtTime(0.4, actx.currentTime + dt);
      g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dt + 0.2);
      o.start(actx.currentTime + dt); o.stop(actx.currentTime + dt + 0.2);
    });
  }
  function ring(t) {
    $("alarmText").textContent = mmss(t.total) + " timer done";
    $("alarm").hidden = false;
    clearInterval(beepTimer);
    beep(); beepTimer = setInterval(beep, 1500);
    if (navigator.vibrate) navigator.vibrate([400, 200, 400]);
    ringing = setTimeout(stopAlarm, 120000);
  }
  function stopAlarm() {
    clearInterval(beepTimer); clearTimeout(ringing);
    $("alarm").hidden = true;
    timers = timers.filter(function (t) { return t.end > Date.now(); });
    save(); renderTimers();
  }
  $("alarmStop").addEventListener("click", stopAlarm);

  /* ---------------- kiosk bits ---------------- */
  function keepAwake() {
    try { if (navigator.wakeLock) navigator.wakeLock.request("screen").catch(function () { }); } catch (e) { }
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") keepAwake(); });
  var first = true;
  document.addEventListener("click", function () {
    if (!first) return; first = false;
    unlockAudio();
    var el = document.documentElement;
    var fs = el.requestFullscreen || el.webkitRequestFullscreen || el.webkitRequestFullScreen;
    try { if (fs) { var r = fs.call(el); if (r && r.catch) r.catch(function () { }); } } catch (e) { }
  });
  // reload once a day at ~3am to pick up changes and free memory
  setInterval(function () {
    var n = new Date();
    if (n.getHours() === 3 && n.getMinutes() === 0 && n.getSeconds() < 2) location.reload();
  }, 1000);

  /* ---------------- start ---------------- */
  function start() {
    document.title = (cfg.title || "Kitchen") + " Board";
    tick(); setInterval(tick, 1000);
    renderTimers();
    keepAwake();
    loadWeather(); setInterval(loadWeather, 10 * 60 * 1000);
    loadMeter(); setInterval(loadMeter, 60 * 1000);
    loadIndoor(); setInterval(loadIndoor, 30 * 1000);
    loadDevice(); setInterval(loadDevice, 30 * 1000);
    loadCalendar(); setInterval(loadCalendar, 5 * 60 * 1000);
    loadNews(); setInterval(loadNews, 15 * 60 * 1000);
    setTimeout(nextTicker, 1500); setInterval(nextTicker, 9000);
  }
  api("/api/config", function (c) {
    for (var k in c) if (c.hasOwnProperty(k)) cfg[k] = c[k];
    cfg.night_mode = cfg.night_mode || {}; cfg.units = cfg.units || {};
    start();
  }, start);
})();
