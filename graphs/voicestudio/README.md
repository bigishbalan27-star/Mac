# VoiceStudio knowledge graph

A [graphify](https://github.com/safishamsi/graphify) graph of the public repo
[debpalash/VoiceStudio](https://github.com/debpalash/VoiceStudio) (an AGPL-3.0 on-device AI voice studio:
clone, design, dub, dictate, transcribe and narrate; Python backend, Electron/React frontend, iOS and Android apps).

- **Source:** `main` at commit `202e213` (shallow clone, 2026-11-25)
- **Scope:** the project's own code: `backend/`, `electron/`, `mobile/`, `native/`, `cli/`, `scripts/`,
  `omnivoice/`, `config/` and the rest. It leaves out `vendor/`, `patches/`, `omnivoice-gallery/`, `tests/`,
  `.github/`, `node_modules`, images and the Markdown docs (the source is 102 MB, so only the graph is committed here).
- **Method:** structural (AST) extraction only, with no LLM and no token cost.
- **Size:** 32,123 nodes, 89,084 edges, 840 communities.

## Use it

No clone of VoiceStudio is needed. The queries read `graph.json` directly:

```bash
graphify query "how does voice cloning work" --graph graphs/voicestudio/graphify-out/graph.json
graphify path "A" "B" --graph graphs/voicestudio/graphify-out/graph.json
graphify explain "tts_backend" --graph graphs/voicestudio/graphify-out/graph.json
```

Each node gives its `src=` file and `loc=` line in the VoiceStudio repo. To read a file, clone it
(`git clone --depth 1 https://github.com/debpalash/VoiceStudio`).

- `graphify-out/GRAPH_REPORT.md`: god nodes, communities and suggested questions.
- `graphify-out/graph.html`: interactive view (one node per community, since there are over 5,000 nodes).

## Rebuild

```bash
scripts/build_voicestudio_graph.sh                        # clones to $TMPDIR/voicestudio-src
scripts/build_voicestudio_graph.sh /path/to/VoiceStudio   # or reuse a clone
```

Needs `graphify` (`uv tool install graphifyy` or `pip install graphifyy`).
