# ruflo knowledge graph

A [graphify](https://github.com/safishamsi/graphify) graph of the public repo
[ruvnet/ruflo](https://github.com/ruvnet/ruflo) (an agent meta-harness for Claude Code and Codex; mostly
TypeScript: `v3/@claude-flow/*` packages, `plugins/`, `ruflo/`).

- **Source:** `main` at commit `f8a62a5` (shallow clone, 2026-11-25)
- **Scope:** the project's own code (TS, JS, shell, Svelte, Rust). It leaves out tests (`tests/`, `__tests__/`,
  `*.test.*`, `*.spec.*`), `verification/`, `dist/`, `node_modules`, JSON/YAML data, images and the Markdown docs.
  The source is 174 MB, so only the graph is committed here.
- **Method:** structural (AST) extraction only, with no LLM and no token cost.
- **Size:** 49,140 nodes, 112,296 edges, 1,521 communities.

## Use it

No clone of ruflo is needed. The queries read `graph.json` directly:

```bash
graphify query "how does swarm coordination work" --graph graphs/ruflo/graphify-out/graph.json
graphify path "A" "B" --graph graphs/ruflo/graphify-out/graph.json
graphify explain "coordinationTools" --graph graphs/ruflo/graphify-out/graph.json
```

Each node gives its `src=` file and `loc=` line in the ruflo repo. To read a file, clone it
(`git clone --depth 1 https://github.com/ruvnet/ruflo`).

- `graphify-out/GRAPH_REPORT.md`: god nodes, communities and suggested questions.
- `graphify-out/graph.html`: interactive view (one node per community, since there are over 5,000 nodes).

## Rebuild

```bash
scripts/build_ruflo_graph.sh                      # clones to $TMPDIR/ruflo-src
scripts/build_ruflo_graph.sh /path/to/ruflo       # or reuse a clone
```

Needs `graphify` (`uv tool install graphifyy` or `pip install graphifyy`).
