#!/bin/bash
# Run on the Mac. Starts a free Cloudflare quick tunnel to the local ai-memory
# server, allows its new hostname in ai-memory's config, restarts ai-memory,
# and prints the hostname to give to Claude (who updates the cloud side).
# Usage: bash ai-memory-quick-tunnel.sh      (leave the window open)
CFG="$HOME/Library/Application Support/ai-memory/config.toml"
LOG=/tmp/ai-memory-tunnel.log

command -v cloudflared >/dev/null || { echo "cloudflared not found. Install 2025.4.0 (see AI_MEMORY_SKILLS.md)."; exit 1; }
[ -f "$CFG" ] || { echo "ai-memory config not found at $CFG. Run: ai-memory setup"; exit 1; }

pkill -f "cloudflared tunnel --url http://127.0.0.1:49374" 2>/dev/null
cloudflared tunnel --url http://127.0.0.1:49374 >"$LOG" 2>&1 &
TPID=$!
echo "Starting tunnel..."

HOSTNAME_FOUND=""
for i in $(seq 1 30); do
  sleep 2
  HOSTNAME_FOUND=$(grep -oE '[a-z0-9-]+\.trycloudflare\.com' "$LOG" | head -1)
  [ -n "$HOSTNAME_FOUND" ] && break
done
[ -n "$HOSTNAME_FOUND" ] || { echo "No tunnel address after 60s. See $LOG"; kill $TPID; exit 1; }

cp "$CFG" "$CFG.bak"
sed -i '' -E "s/^allowed_hosts = .*/allowed_hosts = [\"localhost\", \"127.0.0.1\", \"::1\", \"$HOSTNAME_FOUND\"]/" "$CFG"
launchctl kickstart -k "gui/$(id -u)/com.github.akitaonrails.ai-memory"

OK=""
for i in $(seq 1 15); do
  sleep 2
  curl -s -m 5 "https://$HOSTNAME_FOUND/healthz" | grep -q '"ok"' && { OK=1; break; }
done

echo
if [ -n "$OK" ]; then echo "Tunnel is up and ai-memory answers through it."; else echo "Tunnel started, but ai-memory did not answer yet (it may need another minute)."; fi
echo
echo "  NEW ADDRESS:  $HOSTNAME_FOUND"
echo
echo "Send that address to Claude. Keep this window open; press Ctrl+C to stop the tunnel."
wait $TPID
