# Graph Report - Mac  (2026-11-25)

## Corpus Check
- 101 files · ~98,621 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: (none) 11, .woff2 9, .css 1)

## Summary
- 774 nodes · 1424 edges · 39 communities (30 shown, 9 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.88)
- Token cost: 922,144 input · 0 output

## Graph Freshness
- Built from commit: `5095d053`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Voice and Sound Pipeline
- Claudex Runner Code
- Made-by-Claude Reel Code
- Animated Reels Code
- Claude Skill Setup Reel
- Docs Site Design System
- Skill Setup Reel Code
- Viral Swipe Hooks
- build_ruflo_graph.sh
- Claudex Runner Tests
- Remotion Dependencies
- Claudex CI Workflow
- AI Video Studio Folders
- Claudex Loop Workflow
- Reel Edit Plans
- Build and Inspection Gates
- ADR and Glossary Formats
- TypeScript Config
- Claudex Contributor PRs
- Animated Reels Notes
- Skills reel script (skills_script.txt)
- Skills Reel Notes
- Model Routing
- Cloned Voice Pipeline
- /brag-slim
- Claudex Run Example
- ai_memory_relay.py
- Review Runtime Rules
- Claudex Credits and Deps
- Python ML Dependencies
- Legacy Grill-Me Skill
- Stills Rendering Script
- Docs Board Animation
- Claudex Loop Logo
- Graphify Usage Rules
- ai_memory_session_start.sh
- build_craft_anything_graph.sh
- ai-memory-quick-tunnel.sh
- build_voicestudio_graph.sh

## God Nodes (most connected - your core abstractions)
1. `RunnerTests` - 41 edges
2. `claudex-loop Skill` - 21 edges
3. `Reel edit plans: Mykonos & Bonfire footage` - 20 edges
4. `claude-skills-studio_v1_9x16 notes` - 20 edges
5. `run()` - 19 edges
6. `sp()` - 19 edges
7. `made-by-claude Reel Notes` - 18 edges
8. `remotion` - 16 edges
9. `claude-skill-setup Reel Notes` - 16 edges
10. `lin()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Surface Brief: Landing Page` --semantically_similar_to--> `No Fabricated Evidence Constraint`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → PRODUCT.md
- `Say the comment keyword in the video` --semantically_similar_to--> `Comment SKILLS call to action`  [INFERRED] [semantically similar]
  Social Media/reel-edit-plans.md → AI Video Studio/Exports/animated-reels_source/pipeline/skills_script.txt
- `viral-swipe.md` --semantically_similar_to--> `Social Media/viral-swipe.md`  [INFERRED] [semantically similar]
  Social Media/reel-edit-plans.md → AI Video Studio/Exports/claude-skills-studio_notes.md
- `Direction Contract (stripboard thesis)` --semantically_similar_to--> `The Production Stripboard (Creative North Star)`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → DESIGN.md
- `Signature Interaction: Job Strip Through Five Steps` --semantically_similar_to--> `Motion: Deal, Drop, Rise on Exponential Ease-Out`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → DESIGN.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AI Video Studio Editing Pipeline** — ai_video_studio_raw_readme, ai_video_studio_exports_readme, ai_video_studio_approved_videos_readme, ai_video_studio_editing_style_readme, ai_video_studio_brand_kit_readme, ai_video_studio_references_readme [EXTRACTED 1.00]
- **Skills Sharing claudex-loop Runtime** — plugins_claudex_loop_skills_claudex_loop_skill, plugins_claudex_loop_skills_codex_build_skill, plugins_claudex_loop_skills_codex_review_skill, plugins_claudex_loop_skills_claudex_loop_references_runtime, plugins_claudex_loop_skills_claudex_loop_references_runtime_shared_runner [EXTRACTED 1.00]
- **Claudex Loop Phased Workflow** — plugins_claudex_loop_skills_claudex_loop_skill_phase_0_recon, plugins_claudex_loop_skills_claudex_loop_skill_phase_1_settle_requirements, plugins_claudex_loop_skills_claudex_loop_skill_phase_2_independent_plan_review, plugins_claudex_loop_skills_claudex_loop_skill_phase_3_build_and_inspect [EXTRACTED 1.00]
- **Stripboard Colour Rules** — design_red_is_the_action_rule, design_folder_colour_rule, design_one_ink_rule, design_color_tokens [EXTRACTED 1.00]
- **Five Claude skills that run the video studio** — ai_video_studio_exports_animated_reels_source_pipeline_skills_script_everything_claude_code, ai_video_studio_exports_animated_reels_source_pipeline_skills_script_graphify, ai_video_studio_exports_animated_reels_source_pipeline_skills_script_ig_viral, ai_video_studio_exports_animated_reels_source_pipeline_skills_script_ig_human, ai_video_studio_exports_animated_reels_source_pipeline_skills_script_remotion [EXTRACTED 1.00]
- **Logo brand composition** — plugins_claudex_loop_assets_logo_claudex_wordmark, plugins_claudex_loop_assets_logo_loop_wordmark, plugins_claudex_loop_assets_logo_tagline [EXTRACTED 1.00]
- **Contributor PRs Superseded by PR #16** — plugins_claudex_loop_acknowledgments_pr_11_yaml_frontmatter_fix, plugins_claudex_loop_acknowledgments_pr_13_review_prompt_provenance, plugins_claudex_loop_acknowledgments_pr_15_non_git_plan_reviews, plugins_claudex_loop_acknowledgments_pr_16_bidirectional_workflow [EXTRACTED 1.00]
- **Six-Folder AI Video Studio Workspace** — product_folder_references, product_folder_approved_videos, product_folder_editing_style, product_folder_brand_kit, product_folder_raw, product_folder_exports [EXTRACTED 1.00]
- **Cloned-voice reel production pipeline** — ai_video_studio_exports_animated_reels_notes_chatterbox, ai_video_studio_exports_animated_reels_source_pipeline_voice_gen, ai_video_studio_exports_animated_reels_source_pipeline_tempo, ai_video_studio_exports_animated_reels_source_pipeline_sfx_gen, ai_video_studio_exports_animated_reels_notes_whisper_transcription_check, ai_video_studio_exports_animated_reels_notes_remotion_render [INFERRED 0.85]
- **First-second hook rules** — social_media_readme_first_second_best_shot, social_media_reel_edit_plans_golden_rule_first_second, social_media_readme_weak_hooks_problem, social_media_viral_swipe_place_only_flops [INFERRED 0.85]
- **Job Strip Signature Interaction (brief, design, page, script)** — _impeccable_surfaces_docs_index_html_signature_interaction, design_lanes_and_job_strip, docs_index_job_section, product_editing_workflow, design_motion_system [INFERRED 0.85]
- **Person-first / Manglish hook strategy driving Reels 5 and 6** — social_media_viral_swipe_person_or_feeling_hook, social_media_viral_swipe_manglish_one_liner, social_media_reel_edit_plans_reel6_kerala_rules_uk_kid [INFERRED 0.85]
- **claudex-loop phased planning workflow** — plugins_claudex_loop_assets_run_phase_0_recon, plugins_claudex_loop_assets_run_phase_1_interrogate, plugins_claudex_loop_assets_run_phase_2_review, plugins_claudex_loop_assets_run_plan_locked [INFERRED 0.85]

## Communities (39 total, 9 thin omitted)

### Community 0 - "Voice and Sound Pipeline"
Cohesion: 0.06
Nodes (31): chime(), pop(), whoosh(), display_words(), mouth_from_wav(), main(), matches(), norm() (+23 more)

### Community 1 - "Claudex Runner Code"
Cohesion: 0.08
Nodes (23): finder(), f(), load_words(), main(), validate(), check_approval(), cli_prefix(), codex_effective_settings() (+15 more)

### Community 2 - "Made-by-Claude Reel Code"
Cohesion: 0.08
Nodes (55): Asterisk(), Captions(), Card(), CHAPTERS, Check(), CHIPS, clamp, CODE (+47 more)

### Community 3 - "Animated Reels Code"
Cohesion: 0.05
Nodes (79): Arm(), Avatar(), Hand(), Pose, poseAngles(), AvatarTest(), poses, Bubble() (+71 more)

### Community 4 - "Claude Skill Setup Reel"
Cohesion: 0.09
Nodes (28): build_timing.py fix reviewed by Codex, Chapter Tracker FOLDER · SKILLS · MAP · REVIEW · READY, Mac repo .claude Folder and Plugins, claude-skill-setup_v1_9x16 (captions only, 30.5 s), claude-skill-setup v2 (in my own voice, 28.8 s), claudex-loop SKILL.md, claude-skill-setup Reel Notes, gen.py + assemble.py voice pipeline (+20 more)

### Community 5 - "Docs Site Design System"
Cohesion: 0.06
Nodes (35): Visitor Mode: Persuade (open the repository), Surface Brief: Landing Page, Action Button Component, Design System: AI Video Studio, Full-Bleed Three-Column Board Grid, Break Strip Component, Closing Panel, Color Tokens (board, card, folder colours, red) (+27 more)

### Community 6 - "Skill Setup Reel Code"
Cohesion: 0.11
Nodes (41): Arrow(), Asterisk(), Cap, Captions(), Card(), CardHead(), chapterOf(), CHAPTERS (+33 more)

### Community 7 - "Viral Swipe Hooks"
Cohesion: 0.07
Nodes (25): Caption Drafts, Dad & Son Toddler Travel Caption, Mykonos Cost Breakdown Caption, Comment Replies Log, Instagram 5-Hashtag Limit Update, @bigishbalan Instagram account, Social Media Playbook, 'Driven by passion' Car Reel (1,300 views) (+17 more)

### Community 10 - "Remotion Dependencies"
Cohesion: 0.10
Nodes (22): dependencies, @fontsource/instrument-serif@^5.3.0, @fontsource/inter@^5.3.0, @fontsource/jetbrains-mono@^5.3.0, @fontsource/noto-sans-malayalam@^5.3.0, react@^18.3.1, react-dom@^18.3.1, remotion@^4.0.545 (+14 more)

### Community 11 - "Claudex CI Workflow"
Cohesion: 0.11
Nodes (18): jobs, validate, os, name, on, pull_request, push, permissions (+10 more)

### Community 12 - "AI Video Studio Folders"
Cohesion: 0.13
Nodes (13): Approved Videos, Brand Kit, Brand Assets (logos, colors.md, fonts, intros/outros, music), Editing Style, Style Guide (style-guide.md), Exports, feedback.md Draft Notes, Versioned Export Naming (name_vN, _9x16/_16x9) (+5 more)

### Community 13 - "Claudex Loop Workflow"
Cohesion: 0.20
Nodes (15): Claudex Loop Controls (mode, plan, builder, rounds, inspect, PROOF_CMD), Claudex Loop Workflow Flowchart, Claudex Loop CONTEXT.md Glossary Format, claudex-loop Skill, Host-Based Role Resolution, LOG_FILE (PLAN-REVIEW-LOG.md), MAX_ROUNDS Round Cap, Phase 0 Recon (+7 more)

### Community 14 - "Reel Edit Plans"
Cohesion: 0.15
Nodes (15): Mykonos Series Schedule, (Dropped) Bonfire night through his eyes, Carousel: Our last morning in Mykonos, Dad gym reel (heart hook), v1-v10, Hotel reel v3 (no hands), Hotel reel v4 (opens on Mykonos Bay Hotel sign), Mother's Day 2027 reserved photos, Picsart cinematic versions (LUT grading) (+7 more)

### Community 15 - "Build and Inspection Gates"
Cohesion: 0.24
Nodes (12): PR #12 Build Gates and Wider Review Scope, Act 3 Optional Codex Build, Build and Final Inspection Reference, Change Manifest and Inspected-State Fingerprint, Clean Checkout Gate for Delegated Builds, Pre-Build Commit Baseline, Test Assertions Reflect Acceptance Criteria, --unreviewed-spec Standalone Work Order (+4 more)

### Community 16 - "ADR and Glossary Formats"
Cohesion: 0.24
Nodes (12): Legacy ADR Format, ADR Criteria: Hard to Reverse, Surprising, Real Trade-off, Legacy CONTEXT.md Format, CONTEXT-MAP.md Multi-Context Map, grill-with-docs-codex Skill (legacy), Act 1 Grill With Docs, Offer ADRs Sparingly (three conditions), Challenge Against Glossary / Sharpen Fuzzy Language (+4 more)

### Community 17 - "TypeScript Config"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, jsx, module, moduleResolution, noEmit, resolveJsonModule, skipLibCheck (+2 more)

### Community 18 - "Claudex Contributor PRs"
Cohesion: 0.24
Nodes (10): Claudex Loop Acknowledgments, PR #11 YAML Frontmatter Fix, PR #13 Review-Prompt Provenance and Output Paths, PR #15 Non-Git Plan Reviews, PR #16 Bidirectional Workflow, PR #6 Chinese/Japanese README Translations, PR #9 Reviewer Outages and Provider Fallback, Fixed /tmp/codex-verdict.txt Output Path (+2 more)

### Community 19 - "Animated Reels Notes"
Cohesion: 0.31
Nodes (7): Animated reels: Reel 5 and Reel 6 (notes), Instagram AI info label, kerala-rules_animated_v2_9x16.mp4 (Reel 6 animated), Voice normalised to -15 LUFS, made-by-claude animation style, mykonos-spreadsheet_animated_v2_9x16.mp4 (Reel 5 animated), Remotion render (npx remotion render)

### Community 20 - "Skills reel script (skills_script.txt)"
Cohesion: 0.15
Nodes (16): Comment SKILLS call to action, Graphify (project map, 684 ideas), IG Human (takes the robot out of captions), IG Viral (283x outlier reels), Hook: I'm a nurse. I don't code., Remotion (video as code), Skills reel script (skills_script.txt), graphify-out/graph.json (684 nodes, 1,267 links) (+8 more)

### Community 21 - "Skills Reel Notes"
Cohesion: 0.23
Nodes (10): Everything Claude Code (327 skills, 72 helpers), Avatar.tsx cartoon presenter, claude-skills-studio_v1_9x16 notes, claude-skills-studio_v1_9x16.mp4 (5 Claude skills that run my video studio), Near-black canvas with neon lime glow style, Reference video VID_20261118_220041_323.mp4 (5 Claude skills every beginner needs), Skill-tree map with STUDIO SKILLS n/5 counter, skills_report.json per-line Whisper results (+2 more)

### Community 22 - "Model Routing"
Cohesion: 0.31
Nodes (10): Live-Tested CLI Compatibility Baseline (Codex 0.153.4 / Claude Code 2.1.261), claudex-route Skill, Choose Role Before Model, GPT-6.1 Sol, GPT-6 Luna, Short Routing Brief, Claudex Loop Validation Record, Claude Fable 5.1 (+2 more)

### Community 23 - "Cloned Voice Pipeline"
Cohesion: 0.29
Nodes (5): Chatterbox voice-cloning model, Tempo speed-up to ~151 wpm, voice.md, voice-recording-bigishbalan.m4a reference recording, Whisper word-for-word transcription check

### Community 24 - "/brag-slim"
Cohesion: 0.17
Nodes (11): 1. Inspect, 2. Plan, 3. Build, check, render, 4. Deliver, /brag-slim, Creative laws, Project, Sound (+3 more)

### Community 25 - "Claudex Run Example"
Cohesion: 0.25
Nodes (9): /claudex-loop research=web command, Phase 0 - Recon (assumptions ledger), Phase 1 - Interrogate (decision map), Phase 2 - Review (iterative verdict rounds), Plan locked, PLAN-REVIEW-LOG.md, claudex-loop Run Terminal Illustration (run.svg), VERDICT: APPROVED (+1 more)

### Community 27 - "Review Runtime Rules"
Cohesion: 0.25
Nodes (6): CLI Runtime Reference, Claude Reviewer Boundary (safe-mode, Read/Glob/Grep only), Resume Exact Session UUID, Structured Review Result (verdict/findings/coverage/limitations), Unique Per-Run Artifact Directory, Execute One Scoped Handoff

### Community 28 - "Claudex Credits and Deps"
Cohesion: 0.25
Nodes (7): grill-me-codex Third-Party Notices, Claudex Loop README, Chase AI, Claude Code Plugin Marketplace Install, Matt Pocock Skills (MIT), Peter Steinberger agent-scripts (Codex-as-builder pattern), PyYAML>=6.0,<7

### Community 29 - "Python ML Dependencies"
Cohesion: 0.29
Nodes (8): accelerate 1.15.0, auto-round 0.16.1, NVIDIA CUDA 13 Runtime Packages, datasets 5.2.0, huggingface_hub 2.4.0, Python Dependencies (requirements.txt), torch 2.15.0, transformers 5.23.0

### Community 30 - "Legacy Grill-Me Skill"
Cohesion: 0.29
Nodes (7): grill-me-codex Skill (legacy), Act 1 Grill Interview, Act 2 Codex Adversarial Review Loop, < /dev/null Stdin Redirect for codex exec, Resume with -c sandbox_mode=read-only, Repository History (grill-me-codex, crucible), Codex Read-Only Review Boundary (sandbox, disabled MCP/apps/plugins)

### Community 32 - "Docs Board Animation"
Cohesion: 0.70
Nodes (4): advance(), render(), stopPlaying(), tick()

### Community 33 - "Claudex Loop Logo"
Cohesion: 0.60
Nodes (5): Claudex Loop Logo (logo.svg), CLAUDEX pixel wordmark (coral #d97757), LOOP pixel wordmark (green #10a37f), Tagline: two models, one argument, zero echo chamber, Two-model cross-review concept (Claude + Codex)

## Knowledge Gaps
- **62 isolated node(s):** `Brand Assets (logos, colors.md, fonts, intros/outros, music)`, `Style Guide (style-guide.md)`, `feedback.md Draft Notes`, `Versioned Export Naming (name_vN, _9x16/_16x9)`, `One Subfolder per Editing Job` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 239 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `claude-skills-studio_v1_9x16 notes` connect `Skills Reel Notes` to `Voice and Sound Pipeline`, `Claudex Runner Code`, `Reel Edit Plans`, `Animated Reels Notes`, `Skills reel script (skills_script.txt)`, `Cloned Voice Pipeline`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `Brand Assets (logos, colors.md, fonts, intros/outros, music)`, `Style Guide (style-guide.md)`, `feedback.md Draft Notes` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Voice and Sound Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.06394230769230769 - nodes in this community are weakly interconnected._
- **Why does `Reel edit plans: Mykonos & Bonfire footage` connect `Reel Edit Plans` to `Animated Reels Notes`, `Skills reel script (skills_script.txt)`, `Skills Reel Notes`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `Claudex Runner Code` be split into smaller, more focused modules?**
  _Cohesion score 0.07627118644067797 - nodes in this community are weakly interconnected._
- **Why does `RunnerTests` connect `Claudex Runner Tests` to `Claudex Runner Code`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `Made-by-Claude Reel Code` be split into smaller, more focused modules?**
  _Cohesion score 0.07853107344632769 - nodes in this community are weakly interconnected._