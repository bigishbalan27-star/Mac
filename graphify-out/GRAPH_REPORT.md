# Graph Report - Mac  (2026-11-17)

## Corpus Check
- 26 files · ~23,635 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 8, .woff2 2, .css 1)

## Summary
- 196 nodes · 316 edges · 16 communities (11 shown, 5 thin omitted)
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.87)
- Token cost: 276,026 input · 0 output

## Graph Freshness
- Built from commit: `7a3cf116`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Instagram Playbook Rules
- Studio Folder Guides
- AI Video Studio Landing Page (docs/index.html)
- Reel.tsx
- Studio Workflow And Naming
- sp
- lin
- ML Python Dependencies
- Model Quantization Script
- Board Animation Script
- Graphify Usage Rules
- sfx.py
- Root.tsx
- Reel
- made-by-claude_v1_9x16

## God Nodes (most connected - your core abstractions)
1. `sp()` - 19 edges
2. `Reel Edit Plans (Mykonos & Bonfire)` - 17 edges
3. `lin()` - 15 edges
4. `Social Media Playbook` - 12 edges
5. `AI Video Studio Landing Page (docs/index.html)` - 10 edges
6. `Asterisk()` - 9 edges
7. `Six Folder Structure` - 9 edges
8. `Card()` - 8 edges
9. `AI Video Studio` - 8 edges
10. `S_Pattern()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Surface Brief: Landing Page` --semantically_similar_to--> `No Fabricated Evidence Constraint`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → PRODUCT.md
- `Reel Format (9:16, 15-30 s, middle-third text)` --semantically_similar_to--> `Style Guide (style-guide.md)`  [INFERRED] [semantically similar]
  Social Media/reel-edit-plans.md → AI Video Studio/Editing Style/README.md
- `Versioned Export Naming (name_vN, _9x16/_16x9)` --conceptually_related_to--> `Reel Edit Plans (Mykonos & Bonfire)`  [INFERRED]
  AI Video Studio/Exports/README.md → Social Media/reel-edit-plans.md
- `Direction Contract (stripboard thesis)` --semantically_similar_to--> `The Production Stripboard (Creative North Star)`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → DESIGN.md
- `Signature Interaction: Job Strip Through Five Steps` --semantically_similar_to--> `Motion: Deal, Drop, Rise on Exponential Ease-Out`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → DESIGN.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AI Video Studio Editing Pipeline** — ai_video_studio_raw_readme, ai_video_studio_exports_readme, ai_video_studio_approved_videos_readme, ai_video_studio_editing_style_readme, ai_video_studio_brand_kit_readme, ai_video_studio_references_readme [EXTRACTED 1.00]
- **Stripboard Colour Rules** — design_red_is_the_action_rule, design_folder_colour_rule, design_one_ink_rule, design_color_tokens [EXTRACTED 1.00]
- **Six-Folder AI Video Studio Workspace** — product_folder_references, product_folder_approved_videos, product_folder_editing_style, product_folder_brand_kit, product_folder_raw, product_folder_exports [EXTRACTED 1.00]
- **Job Strip Signature Interaction (brief, design, page, script)** — _impeccable_surfaces_docs_index_html_signature_interaction, design_lanes_and_job_strip, docs_index_job_section, product_editing_workflow, design_motion_system [INFERRED 0.85]
- **Mykonos Series Posts** — social_media_readme_mykonos_series, social_media_reel_edit_plans_reel_1_food, social_media_reel_edit_plans_reel_2_hotel_inspector, social_media_reel_edit_plans_reel_3_beach_day, social_media_reel_edit_plans_october_swim, social_media_reel_edit_plans_reel_4_toddler_friendly, social_media_reel_edit_plans_last_morning_carousel, social_media_reel_edit_plans_mothers_day_reserved [INFERRED 0.85]
- **Hook-First Reel Principles** — social_media_readme_first_second_hook_rule, social_media_reel_edit_plans_golden_rule, social_media_reel_edit_plans_reel_format, social_media_readme_caption_formula [INFERRED 0.85]

## Communities (16 total, 5 thin omitted)

### Community 0 - "Instagram Playbook Rules"
Cohesion: 0.08
Nodes (27): Caption Drafts, Dad & Son Toddler Travel Caption, Mykonos Cost Breakdown Caption, Comment Replies Log, Instagram 5-Hashtag Limit Update, Social Media Playbook, @bigishbalan Instagram Account, Driven by passion Car Reel (+19 more)

### Community 1 - "Studio Folder Guides"
Cohesion: 0.13
Nodes (14): Approved Videos, Brand Kit, Brand Assets (logos, colors.md, fonts, intros/outros, music), Editing Style, Style Guide (style-guide.md), Exports, feedback.md Draft Notes, Versioned Export Naming (name_vN, _9x16/_16x9) (+6 more)

### Community 2 - "AI Video Studio Landing Page (docs/index.html)"
Cohesion: 0.07
Nodes (24): Visitor Mode: Persuade (open the repository), Surface Brief: Landing Page, Action Button Component, Design System: AI Video Studio, Full-Bleed Three-Column Board Grid, Break Strip Component, Closing Panel, Color Tokens (board, card, folder colours, red) (+16 more)

### Community 3 - "Reel.tsx"
Cohesion: 0.10
Nodes (17): CHAPTERS, CHIPS, clamp, CODE, FOLDERS, FPS, ICONS, PAGES (+9 more)

### Community 4 - "Studio Workflow And Naming"
Cohesion: 0.19
Nodes (11): Field Cells and Filename Segments, Job Notes and Draft Naming Section, feedback.md Review Notes, Approved Videos/ folder, Brand Kit/ folder, Editing Style/ folder, Exports/ folder, Raw/ folder (+3 more)

### Community 5 - "sp"
Cohesion: 0.29
Nodes (13): Card(), MiniRef(), Pill(), S_Code(), S_Comment(), S_NoApp(), S_Prompt(), S_Refs() (+5 more)

### Community 6 - "lin"
Cohesion: 0.29
Nodes (12): Asterisk(), Check(), lin(), S_Best(), S_Drew(), S_Fix(), S_Made(), S_NotEdited() (+4 more)

### Community 7 - "ML Python Dependencies"
Cohesion: 0.29
Nodes (8): accelerate 1.15.0, auto-round 0.16.1, NVIDIA CUDA 13 Runtime Packages, datasets 5.2.0, huggingface_hub 2.4.0, Python Dependencies (requirements.txt), torch 2.15.0, transformers 5.23.0

### Community 9 - "Board Animation Script"
Cohesion: 0.70
Nodes (4): advance(), render(), stopPlaying(), tick()

### Community 11 - "sfx.py"
Cohesion: 0.36
Nodes (5): chime(), click(), pop(), thump(), whoosh()

### Community 13 - "Reel"
Cohesion: 0.60
Nodes (5): Captions(), mix(), Reel(), Stage(), Tracker()

## Knowledge Gaps
- **24 isolated node(s):** `Driven by passion Car Reel`, `Weekly Routine`, `Brand Assets (logos, colors.md, fonts, intros/outros, music)`, `feedback.md Draft Notes`, `One Subfolder per Editing Job` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 62 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Reel Edit Plans (Mykonos & Bonfire)` connect `Instagram Playbook Rules` to `Studio Folder Guides`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AI Video Studio Landing Page (docs/index.html)` (e.g. with `Design System: AI Video Studio` and `Static HTML/CSS Single-Page Stack`) actually correct?**
  _`AI Video Studio Landing Page (docs/index.html)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Driven by passion Car Reel`, `Weekly Routine`, `Brand Assets (logos, colors.md, fonts, intros/outros, music)` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Instagram Playbook Rules` be split into smaller, more focused modules?**
  _Cohesion score 0.08067226890756303 - nodes in this community are weakly interconnected._
- **Why does `AI Video Studio Landing Page (docs/index.html)` connect `AI Video Studio Landing Page (docs/index.html)` to `Studio Workflow And Naming`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `Studio Folder Guides` be split into smaller, more focused modules?**
  _Cohesion score 0.1286549707602339 - nodes in this community are weakly interconnected._
- **Should `AI Video Studio Landing Page (docs/index.html)` be split into smaller, more focused modules?**
  _Cohesion score 0.07254623044096728 - nodes in this community are weakly interconnected._