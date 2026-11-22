# ai-memory skills knowledge graph

A [graphify](https://github.com/safishamsi/graphify) graph of the 7 `.claude/skills/ai-memory-*` skills plus `.claude/skills/AI_MEMORY_SKILLS.md`.

- **Size:** 78 nodes (each skill, every `memory_*` MCP tool, and the main mechanisms such as handoffs, the post-compaction anchor, pinned ADR pages and the cross-project profile), 150 edges, 3 hyperedges and 7 communities.
- **Cost:** about 145k AI tokens (one extraction agent).
- **Health:** every file was read to its last line. There are no dangling, missing or self-loop edges.

Use: `graphify query "which tool claims a handoff" --graph graphs/ai-memory-skills/graphify-out/graph.json`. `src=` paths are relative to `.claude/skills/`.
