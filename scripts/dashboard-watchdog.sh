#!/usr/bin/env bash
# Kitchen dashboard watchdog.
# Run on the computer that hosts the dashboard (tablet connected via USB/adb).
# Every INTERVAL seconds it:
#   1. restarts the dashboard server if nothing answers on PORT
#   2. re-creates `adb reverse` so the tablet's localhost:PORT reaches this host
#   3. reloads the tablet's browser after any repair
#
# Usage:
#   DASH_CMD="python3 -m http.server 8765 --directory /path/to/dashboard" \
#     ./scripts/dashboard-watchdog.sh
#
# Env (all optional except DASH_CMD):
#   DASH_CMD   command that starts the server (required)
#   PORT       default 8765
#   INTERVAL   default 15 (seconds)
#   ADB_SERIAL tablet serial if several devices are attached
#   USE_ADB    1 (default) to manage adb reverse; 0 if server runs on the tablet's LAN IP
#   LOG        default ./dashboard-watchdog.log

set -u
: "${DASH_CMD:?Set DASH_CMD to the command that starts the dashboard server}"
PORT="${PORT:-8765}"
INTERVAL="${INTERVAL:-15}"
USE_ADB="${USE_ADB:-1}"
LOG="${LOG:-./dashboard-watchdog.log}"
ADB=(adb)
[ -n "${ADB_SERIAL:-}" ] && ADB=(adb -s "$ADB_SERIAL")

log() { printf '%s %s\n' "$(date '+%F %T')" "$*" | tee -a "$LOG"; }

server_up() { curl -fsS -o /dev/null --max-time 5 "http://127.0.0.1:${PORT}/"; }

tunnel_up() { "${ADB[@]}" reverse --list 2>/dev/null | grep -q "tcp:${PORT}"; }

SERVER_PID=""
start_server() {
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null
  log "starting server: $DASH_CMD"
  bash -c "$DASH_CMD" >>"$LOG" 2>&1 &
  SERVER_PID=$!
  for _ in $(seq 1 20); do server_up && return 0; sleep 1; done
  log "server did not come up within 20s"
  return 1
}

reload_tablet() {
  # Reopen the dashboard in the tablet's Chrome.
  "${ADB[@]}" shell am start -a android.intent.action.VIEW \
    -d "http://localhost:${PORT}/" >/dev/null 2>&1
}

trap 'log "watchdog stopping"; [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null; exit 0' INT TERM

log "watchdog started (port $PORT, every ${INTERVAL}s)"
while true; do
  repaired=0

  if ! server_up; then
    log "server down on :$PORT"
    start_server && repaired=1
  fi

  if [ "$USE_ADB" = "1" ]; then
    if ! "${ADB[@]}" get-state >/dev/null 2>&1; then
      log "tablet not visible to adb; restarting adb server"
      adb kill-server >/dev/null 2>&1; adb start-server >/dev/null 2>&1
    elif ! tunnel_up; then
      log "adb reverse missing; recreating"
      "${ADB[@]}" reverse "tcp:${PORT}" "tcp:${PORT}" >>"$LOG" 2>&1 && repaired=1
    fi
  fi

  [ "$repaired" = "1" ] && [ "$USE_ADB" = "1" ] && reload_tablet && log "tablet reloaded"
  sleep "$INTERVAL"
done
