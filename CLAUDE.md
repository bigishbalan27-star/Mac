## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. When the answer is under a Markdown heading, `graphify section "<heading>"` prints that section's text, so the .md need not be opened. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

## Other graphs

- `graphs/craft-anything/graphify-out/graph.json` is a code graph of [storytold/craft-anything](https://github.com/storytold/craft-anything) (not this repo). For any question about craft-anything, query it first with `--graph`: `graphify query "<question>" --graph graphs/craft-anything/graphify-out/graph.json` (also `path` / `explain`). Node `src=`/`loc=` point into the craft-anything repo; clone it with `git clone --depth 1 https://github.com/storytold/craft-anything` only to read lines the graph located. Rebuild: `scripts/build_craft_anything_graph.sh`. Details: `graphs/craft-anything/README.md`.
- `graphs/hermes-skills/graphify-out/graph.json` is a graph of the 44 `.claude/skills/hermes-*` skills (SKILL.md concepts + helper scripts). To find which Hermes skill fits a task or how they relate, query it first: `graphify query "<question>" --graph graphs/hermes-skills/graphify-out/graph.json`. `src=` paths are relative to `.claude/skills/`. Details: `graphs/hermes-skills/README.md`.
