# Graph Report - mac  (2026-11-19)

## Corpus Check
- 54 files · ~43,878 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 11, .woff2 2, .css 1)

## Summary
- 453 nodes · 695 edges · 28 communities (22 shown, 6 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.87)
- Token cost: 276,026 input · 0 output

## Graph Freshness
- Built from commit: `46523f22`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Instagram Playbook Rules
- RunnerTests
- AI Video Studio Landing Page (docs/index.html)
- Reel.tsx
- runner.py
- ACT 2 — REVIEW (Claude ↔ Codex)
- validate.yml
- ML Python Dependencies
- test_runner.py
- Board Animation Script
- Graphify Usage Rules
- numpy
- ACT 2 — REVIEW (Claude ↔ Codex)
- README.md
- made-by-claude_v1_9x16
- Community contributions and PR reconciliation
- claudex-loop/SKILL.md
- Claudex Loop
- Claudex Route
- ADR Format
- CONTEXT.md — Project Glossary Format
- CLI runtime
- Validation — bidirectional loop
- Install
- Build and final inspection
- Third-Party Notices
- Third-Party Notices

## God Nodes (most connected - your core abstractions)
1. `RunnerTests` - 41 edges
2. `run()` - 19 edges
3. `sp()` - 19 edges
4. `Reel Edit Plans (Mykonos & Bonfire)` - 17 edges
5. `lin()` - 15 edges
6. `RunError` - 14 edges
7. `Social Media Playbook` - 12 edges
8. `AI Video Studio Landing Page (docs/index.html)` - 10 edges
9. `snapshot()` - 9 edges
10. `ACT 2 — REVIEW (Claude ↔ Codex)` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Surface Brief: Landing Page` --semantically_similar_to--> `No Fabricated Evidence Constraint`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → PRODUCT.md
- `Reel Format (9:16, 15-30 s, middle-third text)` --semantically_similar_to--> `Style Guide (style-guide.md)`  [INFERRED] [semantically similar]
  Social Media/reel-edit-plans.md → AI Video Studio/Editing Style/README.md
- `Direction Contract (stripboard thesis)` --semantically_similar_to--> `The Production Stripboard (Creative North Star)`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → DESIGN.md
- `Signature Interaction: Job Strip Through Five Steps` --semantically_similar_to--> `Motion: Deal, Drop, Rise on Exponential Ease-Out`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → DESIGN.md
- `Versioned Export Naming (name_vN, _9x16/_16x9)` --conceptually_related_to--> `Reel Edit Plans (Mykonos & Bonfire)`  [INFERRED]
  AI Video Studio/Exports/README.md → Social Media/reel-edit-plans.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AI Video Studio Editing Pipeline** — ai_video_studio_raw_readme, ai_video_studio_exports_readme, ai_video_studio_approved_videos_readme, ai_video_studio_editing_style_readme, ai_video_studio_brand_kit_readme, ai_video_studio_references_readme [EXTRACTED 1.00]
- **Stripboard Colour Rules** — design_red_is_the_action_rule, design_folder_colour_rule, design_one_ink_rule, design_color_tokens [EXTRACTED 1.00]
- **Six-Folder AI Video Studio Workspace** — product_folder_references, product_folder_approved_videos, product_folder_editing_style, product_folder_brand_kit, product_folder_raw, product_folder_exports [EXTRACTED 1.00]
- **Job Strip Signature Interaction (brief, design, page, script)** — _impeccable_surfaces_docs_index_html_signature_interaction, design_lanes_and_job_strip, docs_index_job_section, product_editing_workflow, design_motion_system [INFERRED 0.85]
- **Mykonos Series Posts** — social_media_readme_mykonos_series, social_media_reel_edit_plans_reel_1_food, social_media_reel_edit_plans_reel_2_hotel_inspector, social_media_reel_edit_plans_reel_3_beach_day, social_media_reel_edit_plans_october_swim, social_media_reel_edit_plans_reel_4_toddler_friendly, social_media_reel_edit_plans_last_morning_carousel, social_media_reel_edit_plans_mothers_day_reserved [INFERRED 0.85]
- **Hook-First Reel Principles** — social_media_readme_first_second_hook_rule, social_media_reel_edit_plans_golden_rule, social_media_reel_edit_plans_reel_format, social_media_readme_caption_formula [INFERRED 0.85]

## Communities (28 total, 6 thin omitted)

### Community 0 - "Instagram Playbook Rules"
Cohesion: 0.05
Nodes (41): Approved Videos, Brand Kit, Brand Assets (logos, colors.md, fonts, intros/outros, music), Editing Style, Style Guide (style-guide.md), Exports, feedback.md Draft Notes, Versioned Export Naming (name_vN, _9x16/_16x9) (+33 more)

### Community 2 - "AI Video Studio Landing Page (docs/index.html)"
Cohesion: 0.06
Nodes (35): Visitor Mode: Persuade (open the repository), Surface Brief: Landing Page, Action Button Component, Design System: AI Video Studio, Full-Bleed Three-Column Board Grid, Break Strip Component, Closing Panel, Color Tokens (board, card, folder colours, red) (+27 more)

### Community 3 - "Reel.tsx"
Cohesion: 0.08
Nodes (55): Asterisk(), Captions(), Card(), CHAPTERS, Check(), CHIPS, clamp, CODE (+47 more)

### Community 4 - "runner.py"
Cohesion: 0.16
Nodes (17): check_approval(), cli_prefix(), codex_effective_settings(), codex_mcp_servers(), command(), digest(), execute(), git() (+9 more)

### Community 5 - "ACT 2 — REVIEW (Claude ↔ Codex)"
Cohesion: 0.06
Nodes (32): ADR Format, Numbering, Optional sections, Template, What qualifies, When to offer an ADR, CONTEXT.md Format, Rules (+24 more)

### Community 6 - "validate.yml"
Cohesion: 0.11
Nodes (18): jobs, validate, os, name, on, pull_request, push, permissions (+10 more)

### Community 7 - "ML Python Dependencies"
Cohesion: 0.29
Nodes (8): accelerate 1.15.0, auto-round 0.16.1, NVIDIA CUDA 13 Runtime Packages, datasets 5.2.0, huggingface_hub 2.4.0, Python Dependencies (requirements.txt), torch 2.15.0, transformers 5.23.0

### Community 8 - "test_runner.py"
Cohesion: 0.08
Nodes (3): finder(), validate(), main()

### Community 9 - "Board Animation Script"
Cohesion: 0.70
Nodes (4): advance(), render(), stopPlaying(), tick()

### Community 11 - "numpy"
Cohesion: 0.21
Nodes (12): add(), chime(), click(), inv(), pop(), thump(), whoosh(), chime() (+4 more)

### Community 12 - "ACT 2 — REVIEW (Claude ↔ Codex)"
Cohesion: 0.14
Nodes (13): ACT 1 — GRILL (you ↔ Claude), ACT 2 — REVIEW (Claude ↔ Codex), ACT 3 (optional) — BUILD (Codex ↔ Claude, roles flipped), Each round, after Codex returns, Grill-Me-Codex — Get Grilled, Then Get Reviewed, Hard rules, Prerequisites (verify once, fast), Resolution (you sign off — final gate) (+5 more)

### Community 13 - "README.md"
Cohesion: 0.22
Nodes (8): Claudex Loop, Claudex Route: standalone task routing, Controls, Development and verification, History and credits, Skills for working across Claude Code and Codex., The Claudex Loop workflow, What an approval means

### Community 14 - "made-by-claude_v1_9x16"
Cohesion: 0.40
Nodes (4): Before posting, made-by-claude_v1_9x16, v3: voiceover in my voice.md style, v4: in my own voice

### Community 16 - "Community contributions and PR reconciliation"
Cohesion: 0.25
Nodes (7): #12 — review scope and tests, #6 — translations, #9 — provider fallback and quota visibility, Community contributions and PR reconciliation, Deliberate adaptations and remaining work, Incorporated and overlapping work, Merge handling

### Community 18 - "Claudex Loop"
Cohesion: 0.29
Nodes (7): Claudex Loop, Phase 0 — Recon, Phase 1 — Settle requirements, Phase 2 — Independent plan review, Phase 3 — Build and inspect, Resolve roles once, Tunables

### Community 19 - "Claudex Route"
Cohesion: 0.29
Nodes (6): Choose the role before the model, Claudex Route, Execute one handoff when requested, Return a short routing brief, Select a practical candidate, Understand the job

### Community 20 - "ADR Format"
Cohesion: 0.40
Nodes (4): ADR Format, Template, The three-part test (all must hold before offering one), What typically passes the test

### Community 21 - "CONTEXT.md — Project Glossary Format"
Cohesion: 0.40
Nodes (4): CONTEXT.md — Project Glossary Format, Repos with more than one domain, Rules, Shape

### Community 22 - "CLI runtime"
Cohesion: 0.40
Nodes (5): CLI runtime, Compatibility, Review boundaries, Roles and commands, Structured review

### Community 23 - "Validation — bidirectional loop"
Cohesion: 0.40
Nodes (4): Automated checks, Limits, Live model checks, Validation — bidirectional loop

### Community 24 - "Install"
Cohesion: 0.50
Nodes (4): Claude Code plugin, Codex or manual skill installation, Examples, Install

### Community 25 - "Build and final inspection"
Cohesion: 0.50
Nodes (4): Build and final inspection, Delegated build, Preparation, Verify and inspect

## Knowledge Gaps
- **24 isolated node(s):** `Driven by passion Car Reel`, `Weekly Routine`, `Bonfire Night Reel (Dropped)`, `Swimming in Mykonos in October`, `Picsart Cinematic Versions (LUT grade)` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 184 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RunnerTests` connect `RunnerTests` to `test_runner.py`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `Driven by passion Car Reel`, `Weekly Routine`, `Bonfire Night Reel (Dropped)` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Instagram Playbook Rules` be split into smaller, more focused modules?**
  _Cohesion score 0.0517120894479385 - nodes in this community are weakly interconnected._
- **Should `RunnerTests` be split into smaller, more focused modules?**
  _Cohesion score 0.08362369337979095 - nodes in this community are weakly interconnected._
- **Should `AI Video Studio Landing Page (docs/index.html)` be split into smaller, more focused modules?**
  _Cohesion score 0.05568627450980392 - nodes in this community are weakly interconnected._
- **Should `Reel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07615018508725542 - nodes in this community are weakly interconnected._
- **Should `ACT 2 — REVIEW (Claude ↔ Codex)` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._