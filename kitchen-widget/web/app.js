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
  var lastOk = Date.now();
  function api(path, ok, bad) {
    var x = new XMLHttpRequest();
    x.open("GET", path + (path.indexOf("?") < 0 ? "?" : "&") + "t=" + Date.now(), true);
    x.timeout = 20000;
    x.onload = function () {
      if (x.status !== 200) { if (bad) bad(); return; }
      var j; try { j = JSON.parse(x.responseText); } catch (e) { if (bad) bad(); return; }
      lastOk = Date.now();
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
      var unit = cfg.units.temperature === "fahrenheit" ? "\u00B0F" : "\u00B0C";
      if (i.rooms && i.rooms.length > 1) {
        var html = "";
        for (var r = 0; r < i.rooms.length; r++) {
          var rm = i.rooms[r], off = rm.online === false || rm.online === "0";
          html += '<div class="room' + (off ? " off" : "") + '"><div class="rl"><div class="rn">' + esc(rm.name) + (off ? " (offline)" : "") + '</div>' +
            '<div class="rs">' + (rm.target !== null && rm.target !== undefined ? "set " + num(rm.target, 1) + "\u00B0" : "") + '</div></div>' +
            '<div class="rt">' + num(rm.temperature, 1) + '<small>' + unit + '</small></div></div>';
        }
        $("rooms").innerHTML = html;
        $("rooms").hidden = false; $("inBig").hidden = true;
        $("inHum").textContent = ""; $("inCo2").textContent = ""; $("inNote").textContent = "";
        return;
      }
      $("rooms").hidden = true; $("inBig").hidden = false;
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
    for (i = 0; i < rg.notes.length; i++) items.push(rg.notes[i]);
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
    if (pf.showing) hideFrame();
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
    // Old Android Chrome has no wake lock: a tiny silent looping video keeps the screen on
    var v = $("awake");
    if (!v) {
      v = document.createElement("video");
      v.id = "awake";
      v.setAttribute("muted", ""); v.muted = true; v.loop = true;
      v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
      v.style.cssText = "position:fixed;right:0;bottom:0;width:2px;height:2px;opacity:0.01;pointer-events:none;";
      var s1 = document.createElement("source"); s1.src = "awake.webm"; s1.type = "video/webm";
      var s2 = document.createElement("source"); s2.src = "awake.mp4"; s2.type = "video/mp4";
      v.appendChild(s1); v.appendChild(s2);
      document.body.appendChild(v);
    }
    try { var pr = v.play(); if (pr && pr.catch) pr.catch(function () { }); } catch (e) { }
  }
  function isFull() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.webkitIsFullScreen);
  }
  function goFull() {
    if (isFull()) return;
    var el = document.documentElement;
    var fs = el.requestFullscreen || el.webkitRequestFullscreen || el.webkitRequestFullScreen;
    try { if (fs) { var r = fs.call(el); if (r && r.catch) r.catch(function () { }); } } catch (e) { }
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") keepAwake(); });
  // every tap: sound allowed, screen kept awake, back to full screen if it dropped out
  document.addEventListener("click", function () { unlockAudio(); keepAwake(); goFull(); }, true);
  document.addEventListener("touchend", function () { keepAwake(); }, true);

  // Watchdog: recover from a frozen page, a sleeping tablet or a lost Mac connection
  var lastBeat = Date.now(), wasDown = false;
  setInterval(function () {
    var now = Date.now();
    if (now - lastBeat > 5 * 60000) { location.reload(); return; }  // tablet slept for a while
    lastBeat = now;
    if (now - lastOk > 90000) {
      wasDown = true;
      $("ticker").className = "warn";
      $("ticker").textContent = "\u26A0 Can't reach the Mac - retrying\u2026";
      api("/api/config", function () { location.reload(); });
    } else if (wasDown) {
      location.reload();
    }
  }, 15000);
  // fresh start every 6 hours and at ~3am, to free memory on the old tablet
  var bootAt = Date.now();
  setInterval(function () {
    var n = new Date();
    if ((n.getHours() === 3 && n.getMinutes() === 0) || Date.now() - bootAt > 6 * 3600000) {
      if (!$("alarm").hidden || timerRunning()) return;  // never during a timer
      location.reload();
    }
  }, 30000);

  /* ---------------- night / idle photo frame ---------------- */
  var pf = { cfg: null, list: [], order: [], pos: 0, showing: false, layer: 0, timer: null, lastTouch: Date.now(), dismissedAt: 0 };
  function loadPhotos() {
    api("/api/photos", function (p) {
      pf.cfg = p;
      if (p.photos.join(",") !== pf.list.join(",")) {
        pf.list = p.photos; pf.order = shuffle(p.photos.slice()); pf.pos = 0;
      }
      if (!p.enabled && pf.showing) hideFrame();
    });
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function isNightHour(h, c) {
    var s0 = c.night_start, e0 = c.night_end;
    if (s0 === null || s0 === undefined || s0 === e0) return false;
    return s0 > e0 ? (h >= s0 || h < e0) : (h >= s0 && h < e0);
  }
  function timerRunning() {
    var now = Date.now();
    for (var i = 0; i < timers.length; i++) if (timers[i].end > now) return true;
    return false;
  }
  function wantFrame() {
    var c = pf.cfg;
    if (!c || !c.enabled || !pf.list.length || timerRunning() || !$("alarm").hidden || !$("door").hidden) return false;
    var idleMs = (c.idle_minutes || 0) * 60000, now = Date.now();
    var idle = idleMs > 0 && now - pf.lastTouch >= idleMs;
    // after a tap, stay on the board for at least 2 minutes (or the idle time)
    var grace = Math.max(120000, idleMs);
    var night = isNightHour(new Date().getHours(), c) && now - pf.dismissedAt >= grace && now - pf.lastTouch >= 120000;
    return idle || night;
  }
  function showNext() {
    if (!pf.order.length) return;
    if (pf.pos >= pf.order.length) { pf.order = shuffle(pf.list.slice()); pf.pos = 0; }
    var id = pf.order[pf.pos++], img = new Image();
    img.onload = function () {
      var next = 1 - pf.layer, el = $("ph" + next);
      el.style.backgroundImage = "url(/photo/" + id + ")";
      el.className = "ph on";
      $("ph" + pf.layer).className = "ph";
      pf.layer = next;
    };
    img.onerror = function () { setTimeout(showNext, 1000); };
    img.src = "/photo/" + id;
  }
  function showFrame() {
    pf.showing = true;
    $("frame").hidden = false;
    frameInfo();
    showNext();
    clearInterval(pf.timer);
    pf.timer = setInterval(showNext, Math.max(5, (pf.cfg && pf.cfg.seconds_per_photo) || 20) * 1000);
  }
  function hideFrame() {
    pf.showing = false;
    clearInterval(pf.timer);
    $("frame").hidden = true;
    $("ph0").className = "ph"; $("ph1").className = "ph";
  }
  function frameInfo() {
    if (!pf.showing) return;
    var d = new Date();
    $("frTime").textContent = fmtTime(d);
    var t = $("wTemp").textContent;
    $("frSub").textContent = DAYS[d.getDay()].slice(0, 3) + " " + d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3) + (t && t !== "--\u00B0" ? "  \u00B7  " + t : "");
  }
  function frameTick() {
    var want = wantFrame();
    if (want && !pf.showing) showFrame();
    else if (!want && pf.showing && (timerRunning() || !$("alarm").hidden)) hideFrame();
    frameInfo();
  }
  function touched() { pf.lastTouch = Date.now(); }
  document.addEventListener("touchstart", touched, true);
  document.addEventListener("mousedown", touched, true);
  $("frame").addEventListener("click", function (e) {
    e.stopPropagation();
    pf.lastTouch = Date.now(); pf.dismissedAt = Date.now();
    hideFrame();
  });

  /* ---------------- Ring doorbell ---------------- */
  var rg = { first: true, lastDing: 0, snapAt: 0, notes: [], openSince: 0, hideTimer: null, skew: 0 };
  function clockOf(at) { return fmtTime(new Date((at - rg.skew) * 1000)); }
  function pollRing() {
    api("/api/ring", function (r) {
      if (!r.enabled) { $("camBtn").hidden = true; return; }
      $("camBtn").hidden = false;
      $("camBtn").textContent = "\uD83D\uDCF7 " + ((r.devices && r.devices[0]) || "Door");
      rg.skew = r.now - Date.now() / 1000;
      var ev = r.events || [], i, newestDing = null;
      rg.notes = [];
      for (i = 0; i < ev.length; i++) {
        var e = ev[i], age = r.now - e.at;
        if (e.kind === "ding" && (!newestDing || e.at > newestDing.at)) newestDing = e;
        if (e.kind === "motion" && age < 600) rg.notes.push({ level: "warn", text: "\uD83D\uDC40 Motion at " + e.device + " \u00B7 " + clockOf(e.at) });
      }
      if (rg.notes.length > 1) rg.notes.length = 1;
      if (newestDing) {
        if (rg.first) rg.lastDing = newestDing.at;      // don't alert for old presses
        else if (newestDing.at > rg.lastDing && r.now - newestDing.at < 180) {
          rg.lastDing = newestDing.at;
          openDoor(true, newestDing);
        }
      }
      rg.first = false;
      if (r.snapshot_at && r.snapshot_at !== rg.snapAt) {
        rg.snapAt = r.snapshot_at;
        if (!$("door").hidden) showSnap();
      }
      if (!$("door").hidden && r.error) $("doorSub").textContent = r.error;
    });
  }
  function showSnap() {
    if (!rg.snapAt) { $("doorWait").textContent = "No picture yet"; return; }
    var img = $("doorImg");
    img.onload = function () { $("doorWait").textContent = ""; };
    img.onerror = function () { $("doorWait").textContent = "No picture available"; };
    img.src = "/ring/snapshot.jpg?t=" + rg.snapAt;
    $("doorSub").textContent = "Picture from " + clockOf(rg.snapAt);
  }
  function chime() {
    if (!actx) return;
    [[659, 0], [523, 0.45]].forEach(function (n) {
      var o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = n[0]; o.connect(g); g.connect(actx.destination);
      g.gain.setValueAtTime(0.5, actx.currentTime + n[1]);
      g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + n[1] + 0.9);
      o.start(actx.currentTime + n[1]); o.stop(actx.currentTime + n[1] + 0.9);
    });
  }
  function openDoor(isDing, e) {
    if (pf.showing) hideFrame();
    $("door").className = isDing ? "ding" : "";
    $("doorTitle").textContent = isDing ? "\uD83D\uDD14 Someone's at the " + e.device : "\uD83D\uDCF7 " + ($("camBtn").textContent.replace("\uD83D\uDCF7 ", ""));
    $("doorImg").removeAttribute("src");
    $("doorWait").textContent = "Getting a picture\u2026";
    $("door").hidden = false;
    rg.openSince = Date.now(); pf.lastTouch = Date.now();
    if (isDing) { chime(); setTimeout(chime, 2500); if (navigator.vibrate) navigator.vibrate([300, 150, 300]); }
    showSnap();
    clearTimeout(rg.hideTimer);
    rg.hideTimer = setTimeout(closeDoor, isDing ? 90000 : 60000);
  }
  function closeDoor() { clearTimeout(rg.hideTimer); $("door").hidden = true; }
  function askSnapshot() {
    var x = new XMLHttpRequest(); x.open("POST", "/api/ring/snapshot", true);
    x.onload = function () { $("doorSub").textContent = x.status === 204 ? "Asking the camera for a new picture\u2026" : "Please wait a minute between pictures"; };
    x.send("");
  }
  $("camBtn").addEventListener("click", function (e) { e.stopPropagation(); unlockAudio(); openDoor(false, null); askSnapshot(); });
  $("doorClose").addEventListener("click", function (e) { e.stopPropagation(); closeDoor(); });
  $("doorRefresh").addEventListener("click", function (e) { e.stopPropagation(); askSnapshot(); });

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
    loadPhotos(); setInterval(loadPhotos, 5 * 60 * 1000);
    setInterval(frameTick, 5000);
    pollRing(); setInterval(pollRing, 4000);
  }
  api("/api/config", function (c) {
    for (var k in c) if (c.hasOwnProperty(k)) cfg[k] = c[k];
    cfg.night_mode = cfg.night_mode || {}; cfg.units = cfg.units || {};
    start();
  }, start);
})();
