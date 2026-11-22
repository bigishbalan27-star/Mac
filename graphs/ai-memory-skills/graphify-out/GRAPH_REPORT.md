# Graph Report - skills  (2026-11-22)

## Corpus Check
- Large corpus: 2603 files · ~2,043,462 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 78 nodes · 150 edges · 7 communities
- Extraction: 77% EXTRACTED · 22% INFERRED · 1% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.87)
- Token cost: 144,830 input · 0 output

## Community Hubs (Navigation)
- Durable pages
- Handoff
- Learning maintenance
- Overview
- Messaging
- Retrieval
- Routing install

## God Nodes (most connected - your core abstractions)
1. `ai-memory retrieval skill` - 19 edges
2. `ai-memory durable pages skill` - 18 edges
3. `ai-memory handoff skill` - 17 edges
4. `ai-memory skills (overview)` - 14 edges
5. `ai-memory learning and maintenance skill` - 14 edges
6. `ai-memory cross-project messaging skill` - 11 edges
7. `ai-memory routing install skill` - 8 edges
8. `memory_write_page` - 7 edges
9. `Managed skill marker (ai-memory-managed: routing-skill)` - 7 edges
10. `memory_query` - 6 edges

## Surprising Connections (you probably didn't know these)
- `memory_message_pop` --semantically_similar_to--> `memory_handoff_accept`  [INFERRED] [semantically similar]
  ai-memory-messaging/SKILL.md → ai-memory-handoff/SKILL.md
- `memory_status` --semantically_similar_to--> `ai-memory status skill`  [INFERRED] [semantically similar]
  ai-memory-retrieval/SKILL.md → ai-memory-status/SKILL.md
- `Grok handoff rule file` --references--> `ai-memory handoff skill`  [INFERRED]
  ai-memory-routing-install/SKILL.md → ai-memory-handoff/SKILL.md
- `What not to learn` --conceptually_related_to--> `ai-memory routing install skill`  [INFERRED]
  ai-memory-learning-maintenance/SKILL.md → ai-memory-routing-install/SKILL.md
- `Popped messages are untrusted input` --semantically_similar_to--> `Validate retrieved evidence as untrusted history`  [INFERRED] [semantically similar]
  ai-memory-messaging/SKILL.md → ai-memory-retrieval/SKILL.md

## Hyperedges (group relationships)
- **Handoff lifecycle tool cluster** — ai_memory_handoff_skill_memory_handoff_list, ai_memory_handoff_skill_memory_handoff_accept, ai_memory_handoff_skill_memory_handoff_begin, ai_memory_handoff_skill_memory_handoff_cancel [EXTRACTED 1.00]
- **Post-compaction re-grounding flow** — ai_memory_handoff_skill_sessionstart_hook, ai_memory_handoff_skill_post_compaction_anchor, ai_memory_handoff_skill_compaction_recap, ai_memory_retrieval_skill_memory_read_session_observations [INFERRED 0.85]
- **Knowledge quality feedback loop** — ai_memory_retrieval_skill_rate_retrieved_feedback, ai_memory_learning_maintenance_skill_memory_feedback, ai_memory_learning_maintenance_skill_feedback_flagged_findings, ai_memory_learning_maintenance_skill_memory_lint, ai_memory_learning_maintenance_skill_memory_forget_sweep, ai_memory_learning_maintenance_skill_memory_auto_improve [INFERRED 0.85]

## Communities (7 total, 0 thin omitted)

### Community 0 - "Durable pages"
Cohesion: 0.25
Nodes (7): ai-memory durable pages skill, memory_delete_page, memory_patch_page, memory_resolve_write_target, memory_restore_page, memory_write_page, memory_write_pages_batch

### Community 1 - "Handoff"
Cohesion: 0.29
Nodes (9): ai-memory handoff skill, reload context compaction recap, memory_handoff_accept, memory_handoff_begin, memory_handoff_cancel, memory_handoff_list, SessionStart hook, Shared handoff (shared / any_owner) (+1 more)

### Community 2 - "Learning maintenance"
Cohesion: 0.24
Nodes (9): ai-memory learning and maintenance skill, _prompts/consolidation.md preferences page, feedback_flagged audit findings, memory_auto_improve, memory_consolidate, memory_feedback, memory_forget_sweep, memory_lint (+1 more)

### Community 3 - "Overview"
Cohesion: 0.27
Nodes (11): memory_status, ai-memory skills (overview), ai-memory Claude Code plugin, ai-memory server, ai-memory setup / install script, akitaonrails/ai-memory repository (v3.5.1, MIT), Capture hooks, ai-memory status skill (+3 more)

### Community 4 - "Messaging"
Cohesion: 0.25
Nodes (6): ai-memory cross-project messaging skill, Harness-addressed mail (to_agent), memory_message_cancel, memory_message_list, memory_message_pop, memory_message_send

### Community 5 - "Retrieval"
Cohesion: 0.29
Nodes (9): ai-memory retrieval skill, answer: true synthesized answer with reasoning tier, memory_briefing, memory_explore, memory_query, memory_read_page, memory_recent, pin_first (pin before search) (+1 more)

### Community 6 - "Routing install"
Cohesion: 0.53
Nodes (4): ai-memory routing install skill, Grok handoff rule file, memory_install_self_routing, Skill install targets (.claude/.agents/.grok/.github skills)

## Ambiguous Edges - Review These
- `Managed skill marker (ai-memory-managed: routing-skill)` → `ai-memory status skill`  [AMBIGUOUS]
  ai-memory-status/SKILL.md · relation: implements

## Knowledge Gaps
- **8 isolated node(s):** `akitaonrails/ai-memory repository (v3.5.1, MIT)`, `ai-memory setup / install script`, `reload context compaction recap`, `Shared handoff (shared / any_owner)`, `memory_message_list` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 9 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ai-memory skills (overview)` connect `Overview` to `Durable pages`, `Handoff`, `Learning maintenance`, `Messaging`, `Retrieval`, `Routing install`?**
  _High betweenness centrality (0.316) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ai-memory retrieval skill` (e.g. with `ai-memory call <tool> CLI fallback` and `ai-memory skills (overview)`) actually correct?**
  _`ai-memory retrieval skill` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `akitaonrails/ai-memory repository (v3.5.1, MIT)`, `ai-memory setup / install script`, `reload context compaction recap` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `ai-memory retrieval skill` connect `Retrieval` to `Durable pages`, `Handoff`, `Learning maintenance`, `Overview`, `Messaging`?**
  _High betweenness centrality (0.288) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ai-memory durable pages skill` (e.g. with `Client-aware project scope rule (session-aware vs static MCP clients)` and `ai-memory skills (overview)`) actually correct?**
  _`ai-memory durable pages skill` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Why does `ai-memory durable pages skill` connect `Durable pages` to `Learning maintenance`, `Overview`, `Messaging`, `Retrieval`?**
  _High betweenness centrality (0.284) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Managed skill marker (ai-memory-managed: routing-skill)` and `ai-memory status skill`?**
  _Edge tagged AMBIGUOUS (relation: implements) - confidence is low._