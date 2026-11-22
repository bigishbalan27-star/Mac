# Hermes skills knowledge graph

A [graphify](https://github.com/safishamsi/graphify) graph of the 44 Hermes Agent skills in
`.claude/skills/hermes-*` (see `.claude/skills/HERMES_SKILLS.md`).

- **Scope:** all 44 `SKILL.md` files plus `HERMES_SKILLS.md` (extracted by AI agents) and the 60
  helper scripts (structural, no tokens). It leaves out the 186 `references/*.md` files.
- **Size:** 1,227 nodes, 2,444 edges, 12 hyperedges, 54 named communities.
- **Cost:** about 705k AI tokens across 4 extraction agents (input and output not reported separately).
- **Health:** 545 dangling edges point at imported Python and Node modules outside the corpus,
  which is normal. There are no missing endpoints. `hermes-popular-web-designs/SKILL.md` was read
  to 213 of 214 lines, so it is marked partial and will be retried on the next update.

## Use it

```bash
graphify query "which skills require approval before sending" --graph graphs/hermes-skills/graphify-out/graph.json
graphify path "Independent Reviewer Subagent" "Hermes Spike Skill" --graph graphs/hermes-skills/graphify-out/graph.json
graphify explain "Citation Ledger" --graph graphs/hermes-skills/graphify-out/graph.json
```

`src=` paths are relative to `.claude/skills/`. `graphify-out/GRAPH_REPORT.md` has the god nodes,
surprising connections and suggested questions. `graphify-out/graph.html` is the interactive view.

## Rebuild

Run `/graphify` on `.claude/skills` from `graphs/hermes-skills/`, keeping only `hermes-*` and
`HERMES_SKILLS.md`. The skill docs need AI extraction, so a rebuild costs tokens. Helper-script
changes alone can be picked up with structural extraction only.
