# Graph Report - mac  (2026-11-19)

## Corpus Check
- 98 files · ~59,293 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 11, .woff2 7, .css 1)

## Summary
- 684 nodes · 1268 edges · 34 communities (30 shown, 4 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 150 edges (avg confidence: 0.88)
- Token cost: 510,827 input · 0 output

## Community Hubs (Navigation)
- Voice Clone Scripts
- Made-by-Claude Reel Code
- Animated Reels Code
- Docs Site Design System
- Claude Skill Setup Reel
- Skill Setup Reel Code
- Claudex Runner Tests
- Sound Effects Synthesis
- Remotion Dependencies
- AI Video Studio Folders
- Claudex CI Workflow
- Animated Reels Notes
- Viral Swipe Hooks
- Reel Edit Plans
- Claudex Loop Workflow
- Social Media Playbook
- Build and Inspection Gates
- ADR and Glossary Formats
- TypeScript Config
- Claudex Contributor PRs
- Model Routing
- Family Travel Voice
- Claudex Run Example
- Review Runtime Rules
- Claudex Credits and Deps
- Python ML Dependencies
- Legacy Grill-Me Skill
- Malayalam Transcript Checks
- Stills Rendering Script
- Docs Board Animation
- Claudex Loop Logo
- Caption Drafts
- Comment Replies Log
- Graphify Usage Rules

## God Nodes (most connected - your core abstractions)
1. `RunnerTests` - 41 edges
2. `claudex-loop Skill` - 21 edges
3. `Reel Edit Plans (Mykonos & Bonfire)` - 20 edges
4. `sp()` - 19 edges
5. `run()` - 19 edges
6. `made-by-claude Reel Notes` - 18 edges
7. `Viral Swipe File: UK Malayali Family Creators` - 17 edges
8. `claude-skill-setup Reel Notes` - 16 edges
9. `Reel6Scenes()` - 15 edges
10. `Reel()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Surface Brief: Landing Page` --semantically_similar_to--> `No Fabricated Evidence Constraint`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → PRODUCT.md
- `Direction Contract (stripboard thesis)` --semantically_similar_to--> `The Production Stripboard (Creative North Star)`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → DESIGN.md
- `Signature Interaction: Job Strip Through Five Steps` --semantically_similar_to--> `Motion: Deal, Drop, Rise on Exponential Ease-Out`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → DESIGN.md
- `Say the Comment Keyword in the Video` --semantically_similar_to--> `Spoken Comment Keywords (plan or go? / Malayalam or English?)`  [INFERRED] [semantically similar]
  Social Media/reel-edit-plans.md → AI Video Studio/Exports/animated-reels_notes.md
- `Claude writes plan, Codex checks, Claude builds, Codex checks again` --semantically_similar_to--> `Claude and Codex Checking Each Other's Work`  [INFERRED] [semantically similar]
  graphify-out/transcripts/claude-skill-setup_v2_9x16.txt → AI Video Studio/Exports/claude-skill-setup_notes.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Job Strip Signature Interaction (brief, design, page, script)** — _impeccable_surfaces_docs_index_html_signature_interaction, design_lanes_and_job_strip, docs_index_job_section, product_editing_workflow, design_motion_system [INFERRED 0.85]
- **AI Video Studio Editing Pipeline** — ai_video_studio_raw_readme, ai_video_studio_exports_readme, ai_video_studio_approved_videos_readme, ai_video_studio_editing_style_readme, ai_video_studio_brand_kit_readme, ai_video_studio_references_readme [EXTRACTED 1.00]
- **Stripboard Colour Rules** — design_red_is_the_action_rule, design_folder_colour_rule, design_one_ink_rule, design_color_tokens [EXTRACTED 1.00]
- **Six-Folder AI Video Studio Workspace** — product_folder_references, product_folder_approved_videos, product_folder_editing_style, product_folder_brand_kit, product_folder_raw, product_folder_exports [EXTRACTED 1.00]
- **Local Chatterbox voice clone + Whisper check pipeline across reels** — ai_video_studio_exports_animated_reels_notes_chatterbox_voice_clone, ai_video_studio_exports_claude_skill_setup_notes_chatterbox_clone, ai_video_studio_exports_made_by_claude_notes_chatterbox_clone, ai_video_studio_exports_animated_reels_notes_whisper_transcribe_back_check, ai_video_studio_exports_made_by_claude_notes_line_match_check [INFERRED 0.85]
- **Person-first / Manglish hook strategy driving Reels 5 and 6** — social_media_viral_swipe_person_or_feeling_hook, social_media_viral_swipe_manglish_one_liner, social_media_reel_edit_plans_reel5_kerala_dads_mykonos_spreadsheet, social_media_reel_edit_plans_reel6_kerala_rules_uk_kid, ai_video_studio_exports_animated_reels_notes_mykonos_spreadsheet_animated_v1, ai_video_studio_exports_animated_reels_notes_kerala_rules_animated_v1 [INFERRED 0.85]
- **First-second hook rules** — social_media_readme_first_second_best_shot, social_media_reel_edit_plans_golden_rule_first_second, social_media_readme_weak_hooks_problem, social_media_viral_swipe_place_only_flops [INFERRED 0.85]
- **Claudex Loop Phased Workflow** — plugins_claudex_loop_skills_claudex_loop_skill_phase_0_recon, plugins_claudex_loop_skills_claudex_loop_skill_phase_1_settle_requirements, plugins_claudex_loop_skills_claudex_loop_skill_phase_2_independent_plan_review, plugins_claudex_loop_skills_claudex_loop_skill_phase_3_build_and_inspect [EXTRACTED 1.00]
- **Skills Sharing claudex-loop Runtime** — plugins_claudex_loop_skills_claudex_loop_skill, plugins_claudex_loop_skills_codex_build_skill, plugins_claudex_loop_skills_codex_review_skill, plugins_claudex_loop_skills_claudex_loop_references_runtime, plugins_claudex_loop_skills_claudex_loop_references_runtime_shared_runner [EXTRACTED 1.00]
- **Contributor PRs Superseded by PR #16** — plugins_claudex_loop_acknowledgments_pr_11_yaml_frontmatter_fix, plugins_claudex_loop_acknowledgments_pr_13_review_prompt_provenance, plugins_claudex_loop_acknowledgments_pr_15_non_git_plan_reviews, plugins_claudex_loop_acknowledgments_pr_16_bidirectional_workflow [EXTRACTED 1.00]
- **Logo brand composition** — plugins_claudex_loop_assets_logo_claudex_wordmark, plugins_claudex_loop_assets_logo_loop_wordmark, plugins_claudex_loop_assets_logo_tagline [EXTRACTED 1.00]
- **claudex-loop phased planning workflow** — plugins_claudex_loop_assets_run_phase_0_recon, plugins_claudex_loop_assets_run_phase_1_interrogate, plugins_claudex_loop_assets_run_phase_2_review, plugins_claudex_loop_assets_run_plan_locked [INFERRED 0.85]

## Communities (34 total, 4 thin omitted)

### Community 0 - "Voice Clone Scripts"
Cohesion: 0.06
Nodes (27): main(), matches(), norm(), n(), finder(), f(), load_words(), main() (+19 more)

### Community 1 - "Made-by-Claude Reel Code"
Cohesion: 0.09
Nodes (53): Asterisk(), Captions(), Card(), CHAPTERS, Check(), CHIPS, clamp, CODE (+45 more)

### Community 2 - "Animated Reels Code"
Cohesion: 0.10
Nodes (43): Bubble(), C, Canvas(), Captions(), Centre(), clamp, Cross(), ease (+35 more)

### Community 3 - "Docs Site Design System"
Cohesion: 0.06
Nodes (35): Visitor Mode: Persuade (open the repository), Surface Brief: Landing Page, Action Button Component, Design System: AI Video Studio, Full-Bleed Three-Column Board Grid, Break Strip Component, Closing Panel, Color Tokens (board, card, folder colours, red) (+27 more)

### Community 4 - "Claude Skill Setup Reel"
Cohesion: 0.06
Nodes (44): References/voice-recording-bigishbalan.m4a, build_timing.py fix reviewed by Codex, Chapter Tracker FOLDER · SKILLS · MAP · REVIEW · READY, Mac repo .claude Folder and Plugins, claude-skill-setup_v1_9x16 (captions only, 30.5 s), claude-skill-setup v2 (in my own voice, 28.8 s), claudex-loop SKILL.md, claude-skill-setup Reel Notes (+36 more)

### Community 5 - "Skill Setup Reel Code"
Cohesion: 0.11
Nodes (42): Arrow(), Asterisk(), Cap, Captions(), Card(), CardHead(), chapterOf(), CHAPTERS (+34 more)

### Community 7 - "Sound Effects Synthesis"
Cohesion: 0.10
Nodes (25): chime(), pop(), whoosh(), chime(), click(), pop(), add(), chime() (+17 more)

### Community 8 - "Remotion Dependencies"
Cohesion: 0.11
Nodes (20): dependencies, @fontsource/instrument-serif@^5.3.0, @fontsource/inter@^5.3.0, @fontsource/noto-sans-malayalam@^5.3.0, react@^18.3.1, react-dom@^18.3.1, remotion@^4.0.545, @remotion/cli@^4.0.545 (+12 more)

### Community 9 - "AI Video Studio Folders"
Cohesion: 0.12
Nodes (14): Approved Videos, Brand Kit, Brand Assets (logos, colors.md, fonts, intros/outros, music), Editing Style, Style Guide (style-guide.md), Exports, feedback.md Draft Notes, Versioned Export Naming (name_vN, _9x16/_16x9) (+6 more)

### Community 10 - "Claudex CI Workflow"
Cohesion: 0.11
Nodes (18): jobs, validate, os, name, on, pull_request, push, permissions (+10 more)

### Community 11 - "Animated Reels Notes"
Cohesion: 0.17
Nodes (9): Animated Reels Notes (Reel 5 & 6), Voice Normalised to -15 LUFS, mykonos-spreadsheet_animated_v1_9x16.mp4 (Reel 5 animated, 37.0 s), Reel 5 Numbers Unconfirmed (12 planned / 9 cancelled / 3 done), Remotion render Reel5, Spoken Comment Keywords (plan or go? / Malayalam or English?), 'Parents, plan or go, comment below' CTA, mykonos-spreadsheet animated v1 transcript (+1 more)

### Community 12 - "Viral Swipe Hooks"
Cohesion: 0.18
Nodes (12): 'Driven by passion' Car Reel (1,300 views), Reel 6: Kerala rules, UK kid, Candidly Niya (283x outlier), Viral Swipe File: UK Malayali Family Creators, Homegrown Harvest (weak finding), ig-reel/hooks.json, /ig-reel skill, Kerala Life Lived in the UK (+4 more)

### Community 13 - "Reel Edit Plans"
Cohesion: 0.15
Nodes (13): Most meals 10-20 euros, (Dropped) Bonfire night through his eyes, Dad Gym Reel (heart hook, v1-v10), Reel Edit Plans (Mykonos & Bonfire), Hotel reel v3 (9.4 s, no hands), Hotel reel v4 (opens on hotel sign), Mother's Day 2027 Reserved Photos, Picsart Cinematic Versions (LUT grade) (+5 more)

### Community 14 - "Claudex Loop Workflow"
Cohesion: 0.20
Nodes (15): Claudex Loop Controls (mode, plan, builder, rounds, inspect, PROOF_CMD), Claudex Loop Workflow Flowchart, Claudex Loop CONTEXT.md Glossary Format, claudex-loop Skill, Host-Based Role Resolution, LOG_FILE (PLAN-REVIEW-LOG.md), MAX_ROUNDS Round Cap, Phase 0 Recon (+7 more)

### Community 15 - "Social Media Playbook"
Cohesion: 0.18
Nodes (7): @bigishbalan Instagram account, Social Media Playbook, 'Full film on YouTube - link in bio' ending, The roaming lens (YouTube channel), Weak Hooks: 65-80% skip in first 3 s, Weekly Routine (~20 min), YouTube Retitles (The roaming lens)

### Community 16 - "Build and Inspection Gates"
Cohesion: 0.24
Nodes (12): PR #12 Build Gates and Wider Review Scope, Act 3 Optional Codex Build, Build and Final Inspection Reference, Change Manifest and Inspected-State Fingerprint, Clean Checkout Gate for Delegated Builds, Pre-Build Commit Baseline, Test Assertions Reflect Acceptance Criteria, --unreviewed-spec Standalone Work Order (+4 more)

### Community 17 - "ADR and Glossary Formats"
Cohesion: 0.24
Nodes (12): Legacy ADR Format, ADR Criteria: Hard to Reverse, Surprising, Real Trade-off, Legacy CONTEXT.md Format, CONTEXT-MAP.md Multi-Context Map, grill-with-docs-codex Skill (legacy), Act 1 Grill With Docs, Offer ADRs Sparingly (three conditions), Challenge Against Glossary / Sharpen Fuzzy Language (+4 more)

### Community 18 - "TypeScript Config"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, jsx, module, moduleResolution, noEmit, resolveJsonModule, skipLibCheck (+2 more)

### Community 19 - "Claudex Contributor PRs"
Cohesion: 0.24
Nodes (10): Claudex Loop Acknowledgments, PR #11 YAML Frontmatter Fix, PR #13 Review-Prompt Provenance and Output Paths, PR #15 Non-Git Plan Reviews, PR #16 Bidirectional Workflow, PR #6 Chinese/Japanese README Translations, PR #9 Reviewer Outages and Provider Fallback, Fixed /tmp/codex-verdict.txt Output Path (+2 more)

### Community 20 - "Model Routing"
Cohesion: 0.31
Nodes (10): Live-Tested CLI Compatibility Baseline (Codex 0.153.4 / Claude Code 2.1.261), claudex-route Skill, Choose Role Before Model, GPT-6.1 Sol, GPT-6 Luna, Short Routing Brief, Claudex Loop Validation Record, Claude Fable 5.1 (+2 more)

### Community 21 - "Family Travel Voice"
Cohesion: 0.22
Nodes (9): Family is first, Works as a nurse (busy schedule), October end-of-season Greece trip, Save, message or comment to get the trip list, Voice recording part 2 (creator self-introduction), Explore at least two places/countries every year, Mykonos Series Schedule, Niche: UK Mallu Dad Family Travel (+1 more)

### Community 22 - "Claudex Run Example"
Cohesion: 0.25
Nodes (9): /claudex-loop research=web command, Phase 0 - Recon (assumptions ledger), Phase 1 - Interrogate (decision map), Phase 2 - Review (iterative verdict rounds), Plan locked, PLAN-REVIEW-LOG.md, claudex-loop Run Terminal Illustration (run.svg), VERDICT: APPROVED (+1 more)

### Community 23 - "Review Runtime Rules"
Cohesion: 0.25
Nodes (6): CLI Runtime Reference, Claude Reviewer Boundary (safe-mode, Read/Glob/Grep only), Resume Exact Session UUID, Structured Review Result (verdict/findings/coverage/limitations), Unique Per-Run Artifact Directory, Execute One Scoped Handoff

### Community 24 - "Claudex Credits and Deps"
Cohesion: 0.25
Nodes (7): grill-me-codex Third-Party Notices, Claudex Loop README, Chase AI, Claude Code Plugin Marketplace Install, Matt Pocock Skills (MIT), Peter Steinberger agent-scripts (Codex-as-builder pattern), PyYAML>=6.0,<7

### Community 25 - "Python ML Dependencies"
Cohesion: 0.29
Nodes (8): accelerate 1.15.0, auto-round 0.16.1, NVIDIA CUDA 13 Runtime Packages, datasets 5.2.0, huggingface_hub 2.4.0, Python Dependencies (requirements.txt), torch 2.15.0, transformers 5.23.0

### Community 26 - "Legacy Grill-Me Skill"
Cohesion: 0.29
Nodes (7): grill-me-codex Skill (legacy), Act 1 Grill Interview, Act 2 Codex Adversarial Review Loop, < /dev/null Stdin Redirect for codex exec, Resume with -c sandbox_mode=read-only, Repository History (grill-me-codex, crucible), Codex Read-Only Review Boundary (sandbox, disabled MCP/apps/plugins)

### Community 27 - "Malayalam Transcript Checks"
Cohesion: 0.50
Nodes (3): kerala-rules_animated_v1_9x16.mp4 (Reel 6 animated, 33.5 s), 'Choru venno' heard as 'Coruveno'; 'Mallu' as 'Malu', kerala-rules animated v1 transcript

### Community 29 - "Docs Board Animation"
Cohesion: 0.70
Nodes (4): advance(), render(), stopPlaying(), tick()

### Community 30 - "Claudex Loop Logo"
Cohesion: 0.60
Nodes (5): Claudex Loop Logo (logo.svg), CLAUDEX pixel wordmark (coral #d97757), LOOP pixel wordmark (green #10a37f), Tagline: two models, one argument, zero echo chamber, Two-model cross-review concept (Claude + Codex)

### Community 31 - "Caption Drafts"
Cohesion: 0.50
Nodes (4): Caption Drafts, Dad & Son Toddler Travel Caption, Mykonos Cost Breakdown Caption, Guide-Style Captions earn saves

## Knowledge Gaps
- **64 isolated node(s):** `Brand Assets (logos, colors.md, fonts, intros/outros, music)`, `Style Guide (style-guide.md)`, `Versioned Export Naming (name_vN, _9x16/_16x9)`, `feedback.md Draft Notes`, `One Subfolder per Editing Job` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 190 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Animated Reels Notes (Reel 5 & 6)` connect `Animated Reels Notes` to `Voice Clone Scripts`, `Claude Skill Setup Reel`, `Sound Effects Synthesis`, `Reel Edit Plans`, `Malayalam Transcript Checks`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `Brand Assets (logos, colors.md, fonts, intros/outros, music)`, `Style Guide (style-guide.md)`, `Versioned Export Naming (name_vN, _9x16/_16x9)` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Voice Clone Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.06293706293706294 - nodes in this community are weakly interconnected._
- **Why does `Reel Edit Plans (Mykonos & Bonfire)` connect `Reel Edit Plans` to `AI Video Studio Folders`, `Animated Reels Notes`, `Viral Swipe Hooks`, `Social Media Playbook`, `Family Travel Voice`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `Made-by-Claude Reel Code` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._
- **Why does `RunnerTests` connect `Claudex Runner Tests` to `Voice Clone Scripts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `Animated Reels Code` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._