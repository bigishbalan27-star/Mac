# Graph Report - mac  (2026-11-17)

## Corpus Check
- Corpus is ~14,723 words - fits in a single context window. You may not need a graph.

## Summary
- 126 nodes · 168 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.87)
- Token cost: 276,026 input · 0 output

## Community Hubs (Navigation)
- Instagram Playbook Rules
- Studio Folder Guides
- Landing Page Direction
- Mykonos Reel Plans
- Studio Workflow And Naming
- Stripboard Components And Colour
- Typography And Principles
- ML Python Dependencies
- Model Quantization Script
- Board Animation Script
- Graphify Usage Rules

## God Nodes (most connected - your core abstractions)
1. `Reel Edit Plans (Mykonos & Bonfire)` - 17 edges
2. `Social Media Playbook` - 12 edges
3. `AI Video Studio Landing Page (docs/index.html)` - 10 edges
4. `Six Folder Structure` - 9 edges
5. `AI Video Studio` - 8 edges
6. `Python Dependencies (requirements.txt)` - 7 edges
7. `Design System: AI Video Studio` - 7 edges
8. `Action Button Component` - 6 edges
9. `tick()` - 5 edges
10. `Exports` - 5 edges

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
- **Hook-First Reel Principles** — social_media_readme_first_second_hook_rule, social_media_reel_edit_plans_golden_rule, social_media_reel_edit_plans_reel_format, social_media_readme_caption_formula [INFERRED 0.85]
- **Mykonos Series Posts** — social_media_readme_mykonos_series, social_media_reel_edit_plans_reel_1_food, social_media_reel_edit_plans_reel_2_hotel_inspector, social_media_reel_edit_plans_reel_3_beach_day, social_media_reel_edit_plans_october_swim, social_media_reel_edit_plans_reel_4_toddler_friendly, social_media_reel_edit_plans_last_morning_carousel, social_media_reel_edit_plans_mothers_day_reserved [INFERRED 0.85]
- **Six-Folder AI Video Studio Workspace** — product_folder_references, product_folder_approved_videos, product_folder_editing_style, product_folder_brand_kit, product_folder_raw, product_folder_exports [EXTRACTED 1.00]
- **Job Strip Signature Interaction (brief, design, page, script)** — _impeccable_surfaces_docs_index_html_signature_interaction, design_lanes_and_job_strip, docs_index_job_section, product_editing_workflow, design_motion_system [INFERRED 0.85]
- **Stripboard Colour Rules** — design_red_is_the_action_rule, design_folder_colour_rule, design_one_ink_rule, design_color_tokens [EXTRACTED 1.00]

## Communities (11 total, 2 thin omitted)

### Community 0 - "Instagram Playbook Rules"
Cohesion: 0.12
Nodes (13): Mykonos Cost Breakdown Caption, Comment Replies Log, Instagram 5-Hashtag Limit Update, Social Media Playbook, @bigishbalan Instagram Account, Driven by passion Car Reel, Guide-Style Captions, The roaming lens (YouTube channel) (+5 more)

### Community 1 - "Studio Folder Guides"
Cohesion: 0.13
Nodes (14): Approved Videos, Brand Kit, Brand Assets (logos, colors.md, fonts, intros/outros, music), Editing Style, Style Guide (style-guide.md), Exports, feedback.md Draft Notes, Versioned Export Naming (name_vN, _9x16/_16x9) (+6 more)

### Community 2 - "Landing Page Direction"
Cohesion: 0.16
Nodes (11): Visitor Mode: Persuade (open the repository), Surface Brief: Landing Page, Design System: AI Video Studio, Full-Bleed Three-Column Board Grid, Strip Component (signature), The Board Section (six folder strips), Copy the Board Closing Section, GitHub Repository Link (AI Video Studio) (+3 more)

### Community 3 - "Mykonos Reel Plans"
Cohesion: 0.18
Nodes (14): Caption Drafts, Dad & Son Toddler Travel Caption, 4 Content Pillars, Mykonos Reel Series Schedule, Reel Edit Plans (Mykonos & Bonfire), Bonfire Night Reel (Dropped), Dad Gym Reel (v1-v10), Hotel Inspector Reel v3/v4 (+6 more)

### Community 4 - "Studio Workflow And Naming"
Cohesion: 0.19
Nodes (11): Field Cells and Filename Segments, Job Notes and Draft Naming Section, feedback.md Review Notes, Approved Videos/ folder, Brand Kit/ folder, Editing Style/ folder, Exports/ folder, Raw/ folder (+3 more)

### Community 5 - "Stripboard Components And Colour"
Cohesion: 0.22
Nodes (7): Action Button Component, Break Strip Component, Closing Panel, Color Tokens (board, card, folder colours, red), Lanes and the Job Strip (signature), Navigation Break Strip, Header Strip: Six folders that teach an AI editor your style

### Community 6 - "Typography And Principles"
Cohesion: 0.22
Nodes (6): Ruled List Component, Tabs Component, Typography: Sofia Sans Extra Condensed + Sofia Sans, SIL Open Font License 1.1, Sofia Sans Project (lettersoup), Style Order Section

### Community 7 - "ML Python Dependencies"
Cohesion: 0.29
Nodes (8): accelerate 1.15.0, auto-round 0.16.1, NVIDIA CUDA 13 Runtime Packages, datasets 5.2.0, huggingface_hub 2.4.0, Python Dependencies (requirements.txt), torch 2.15.0, transformers 5.23.0

### Community 9 - "Board Animation Script"
Cohesion: 0.70
Nodes (4): advance(), render(), stopPlaying(), tick()

## Knowledge Gaps
- **24 isolated node(s):** `Brand Assets (logos, colors.md, fonts, intros/outros, music)`, `feedback.md Draft Notes`, `One Subfolder per Editing Job`, `Driven by passion Car Reel`, `Weekly Routine` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 37 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Reel Edit Plans (Mykonos & Bonfire)` connect `Mykonos Reel Plans` to `Instagram Playbook Rules`, `Studio Folder Guides`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AI Video Studio Landing Page (docs/index.html)` (e.g. with `Design System: AI Video Studio` and `Static HTML/CSS Single-Page Stack`) actually correct?**
  _`AI Video Studio Landing Page (docs/index.html)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Brand Assets (logos, colors.md, fonts, intros/outros, music)`, `feedback.md Draft Notes`, `One Subfolder per Editing Job` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Instagram Playbook Rules` be split into smaller, more focused modules?**
  _Cohesion score 0.12105263157894737 - nodes in this community are weakly interconnected._
- **Why does `AI Video Studio Landing Page (docs/index.html)` connect `Landing Page Direction` to `Studio Workflow And Naming`, `Stripboard Components And Colour`, `Typography And Principles`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Six Folder Structure` (e.g. with `The Folder Colour Rule` and `The Board Section (six folder strips)`) actually correct?**
  _`Six Folder Structure` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Studio Folder Guides` be split into smaller, more focused modules?**
  _Cohesion score 0.1286549707602339 - nodes in this community are weakly interconnected._