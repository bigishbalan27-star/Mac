#!/usr/bin/env bash
# SessionStart hook: connect a cloud session to the user's ai-memory server.
# Does nothing unless AI_MEMORY_REMOTE (e.g. https://<tunnel-host>) is set on
# the environment. Installs the ai-memory client if missing (checksum-verified)
# and starts scripts/ai_memory_relay.py on 127.0.0.1:49374. Never fails the session.
[ -n "$AI_MEMORY_REMOTE" ] || exit 0
dir="$(cd "$(dirname "$0")/.." && pwd)"
bin="$HOME/.local/bin/ai-memory"

if [ ! -x "$bin" ]; then
  tmp=$(mktemp -d)
  url=https://github.com/akitaonrails/ai-memory/releases/latest/download/ai-memory-linux-x86_64.tar.gz
  if curl -fsSL -o "$tmp/a.tgz" "$url" && curl -fsSL -o "$tmp/a.sha256" "$url.sha256" \
     && [ "$(sha256sum "$tmp/a.tgz" | cut -d' ' -f1)" = "$(cut -d' ' -f1 "$tmp/a.sha256")" ]; then
    tar -xzf "$tmp/a.tgz" -C "$tmp" && mkdir -p "$HOME/.local/bin" && install -m 755 "$tmp/ai-memory" "$bin"
  else
    echo "ai-memory: client download or checksum failed; memory tools unavailable" >&2
  fi
  rm -rf "$tmp"
fi

if ! curl -s -m 3 http://127.0.0.1:49374/healthz >/dev/null 2>&1; then
  AI_MEMORY_REMOTE="$AI_MEMORY_REMOTE" setsid nohup python3 "$dir/scripts/ai_memory_relay.py" >/tmp/aim-relay.log 2>&1 < /dev/null &
  sleep 1
fi
curl -s -m 10 http://127.0.0.1:49374/healthz 2>/dev/null | grep -q '"ok"' \
  || echo "ai-memory: server not reachable at $AI_MEMORY_REMOTE (tunnel down or host changed?)" >&2
exit 0
