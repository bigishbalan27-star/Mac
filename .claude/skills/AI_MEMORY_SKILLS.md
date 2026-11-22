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
