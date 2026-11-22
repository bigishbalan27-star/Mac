# ai-memory skills

The 7 Claude Code skills from [akitaonrails/ai-memory](https://github.com/akitaonrails/ai-memory) `plugins/claude-code/skills/` at commit `6a14185` (plugin v3.5.1, MIT, Copyright (c) 2026 Fabio Akita). The only change is that `status` is renamed to `ai-memory-status`.

**They need a running ai-memory server.** Each skill drives the server's `memory_*` MCP tools (or `ai-memory call <tool> '<json>'`). Without a server they do nothing. The memory lives in the server, so it has to run somewhere persistent: your computer, a homelab box or a VPS. A cloud session container is not suitable because it is wiped after the session.

## Set it up (on a machine that stays up)

1. Install the binary and run setup. The install script checks the release's SHA-256 checksum:
   `curl -fsSL https://github.com/akitaonrails/ai-memory/releases/latest/download/install.sh | sh`, then `ai-memory setup`.
   Alternatives: `brew install akitaonrails/tap/ai-memory`, the AUR packages, the RPM, Docker, or the macOS app.
2. Connect Claude Code. Either install the plugin, which adds the capture hooks and MCP tools:
   `/plugin marketplace add akitaonrails/ai-memory`, then `/plugin install ai-memory@ai-memory`.
   Or let `ai-memory setup` wire the agents.
3. For cloud sessions to use it, the server must be reachable over HTTPS from this environment, with its host on the network allowlist and its bearer token stored as an environment secret. Never commit the token.

## Privacy

Once set up, the hooks send every prompt and tool call (sanitized) to your server. Read the upstream `DATA_HANDLING.md` and `SECURITY.md` before turning that on.

## Cloud sessions (Claude Code on the web)

ai-memory's MCP bridge and hooks ignore HTTPS proxies, but a cloud container can only reach the internet through its proxy. `scripts/ai_memory_relay.py` bridges the two: it listens on `127.0.0.1:49374`, where ai-memory looks by default, and forwards through the proxy to your server. Setup used here:

1. On the Mac, run `cloudflared tunnel --url http://127.0.0.1:49374` (version 2025.4.0 or older on macOS before 12), and add the tunnel host to `allowed_hosts` on line 33 of `~/Library/Application Support/ai-memory/config.toml`.
2. In the `mac` cloud environment, add the tunnel host to the allowed hosts and save a network secret for it: header `Authorization`, prefix `Bearer`, value from `auth-tokens/default`. The proxy adds the token, so it is never in the repo or the session.
3. In the session, install the client from the `ai-memory-linux-x86_64.tar.gz` release and check its `.sha256`. Then start the relay:
   `AI_MEMORY_REMOTE=https://<tunnel-host> nohup python3 scripts/ai_memory_relay.py >/tmp/aim-relay.log 2>&1 &`
   and run `AI_MEMORY_AUTH_TOKEN=placeholder ai-memory call memory_status '{}'`. The placeholder only gets past the CLI's "token required" check; the proxy replaces it.

**Automated:** the `mac` environment sets `AI_MEMORY_REMOTE`, and a SessionStart hook in `.claude/settings.json` runs `scripts/ai_memory_session_start.sh`. That script installs the client (checksum-verified) and starts the relay in every new session. If the server can't be reached, it prints a one-line notice and the session carries on.

A quick tunnel gets a new random host every time `cloudflared` restarts, so redo steps 1–2 with the new host and update `AI_MEMORY_REMOTE` on the `mac` environment. A named Cloudflare tunnel on your own domain keeps a fixed host.
