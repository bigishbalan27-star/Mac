# craft-anything knowledge graph

A [graphify](https://github.com/safishamsi/graphify) graph of the public repo
[storytold/craft-anything](https://github.com/storytold/craft-anything) (a pure-Rust app that studies
websites, apps and games and has a coding agent build its own version of them).

- **Source:** `main` at commit `e64d7cb` (shallow clone, 2026-11-22)
- **Scope:** the project's own code only: 886 files in `crates/`, `apps/`, `xtask/`, `examples/`,
  `packaging/`, `.github/`. It leaves out `vendor/` (third-party code), images and the Markdown docs.
- **Method:** structural (AST) extraction only, with no LLM and no token cost.
- **Size:** 21,447 nodes, 58,049 edges, 591 communities. Each community is named after the source
  file most of its nodes come from, e.g. `engine: tool`.

## Use it

No clone of craft-anything is needed. The queries read `graph.json` directly:

```bash
graphify query "how does the MCP server dispatch tools" --graph graphs/craft-anything/graphify-out/graph.json
graphify path "Server" "Engine" --graph graphs/craft-anything/graphify-out/graph.json
graphify explain "ToolSpec" --graph graphs/craft-anything/graphify-out/graph.json
```

Each node gives its `src=` file and `loc=` line in the craft-anything repo. To read a file, clone
the repo (`git clone --depth 1 https://github.com/storytold/craft-anything`).

- `graphify-out/GRAPH_REPORT.md`: god nodes, communities and suggested questions.
- `graphify-out/graph.html`: interactive view. With more than 5,000 nodes it shows one node per community.

## Rebuild

```bash
scripts/build_craft_anything_graph.sh            # clones to $TMPDIR/craft-anything-src
scripts/build_craft_anything_graph.sh /path/to/craft-anything   # or reuse a clone
```

Needs `graphify` (`uv tool install graphifyy`).
