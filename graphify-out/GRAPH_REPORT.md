# Graph Report - mac  (2026-11-22)

## Corpus Check
- 21 files · ~80,707 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 773 nodes · 1446 edges · 36 communities (32 shown, 4 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 160 edges (avg confidence: 0.88)
- Token cost: 135,291 input · 0 output

## Community Hubs (Navigation)
- Voice and Sound Pipeline
- Claudex Runner Code
- Made-by-Claude Reel Code
- Animated Reels Code
- Claude Skill Setup Reel
- Docs Site Design System
- Skill Setup Reel Code
- Viral Swipe Hooks
- Skills Reel Code
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
- Real Data Sources
- Skills Reel Notes
- Model Routing
- Cloned Voice Pipeline
- Five Studio Skills
- Claudex Run Example
- Reel 6 and Comment CTAs
- Review Runtime Rules
- Claudex Credits and Deps
- Python ML Dependencies
- Legacy Grill-Me Skill
- Stills Rendering Script
- Docs Board Animation
- Claudex Loop Logo
- Graphify Usage Rules
- Reel 5 v1 Transcript CTA

## God Nodes (most connected - your core abstractions)
1. `RunnerTests` - 41 edges
2. `claudex-loop Skill` - 21 edges
3. `claude-skills-studio_v1_9x16 notes` - 20 edges
4. `Reel edit plans: Mykonos & Bonfire footage` - 20 edges
5. `run()` - 19 edges
6. `sp()` - 19 edges
7. `made-by-claude Reel Notes` - 18 edges
8. `claude-skill-setup Reel Notes` - 16 edges
9. `remotion` - 16 edges
10. `lin()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Surface Brief: Landing Page` --semantically_similar_to--> `No Fabricated Evidence Constraint`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → PRODUCT.md
- `Transcript: mykonos-spreadsheet_animated_v2_9x16` --semantically_similar_to--> `Reel 5: Kerala dad's Mykonos spreadsheet`  [INFERRED] [semantically similar]
  graphify-out/transcripts/mykonos-spreadsheet_animated_v2_9x16.txt → Social Media/reel-edit-plans.md
- `Direction Contract (stripboard thesis)` --semantically_similar_to--> `The Production Stripboard (Creative North Star)`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → DESIGN.md
- `Signature Interaction: Job Strip Through Five Steps` --semantically_similar_to--> `Motion: Deal, Drop, Rise on Exponential Ease-Out`  [INFERRED] [semantically similar]
  .impeccable/surfaces/docs-index-html.md → DESIGN.md
- `Claude writes plan, Codex checks, Claude builds, Codex checks again` --semantically_similar_to--> `Claude and Codex Checking Each Other's Work`  [INFERRED] [semantically similar]
  graphify-out/transcripts/claude-skill-setup_v2_9x16.txt → AI Video Studio/Exports/claude-skill-setup_notes.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AI Video Studio Editing Pipeline** — ai_video_studio_raw_readme, ai_video_studio_exports_readme, ai_video_studio_approved_videos_readme, ai_video_studio_editing_style_readme, ai_video_studio_brand_kit_readme, ai_video_studio_references_readme [EXTRACTED 1.00]
- **Skills Sharing claudex-loop Runtime** — plugins_claudex_loop_skills_claudex_loop_skill, plugins_claudex_loop_skills_codex_build_skill, plugins_claudex_loop_skills_codex_review_skill, plugins_claudex_loop_skills_claudex_loop_references_runtime, plugins_claudex_loop_skills_claudex_loop_references_runtime_shared_runner [EXTRACTED 1.00]
- **Claudex Loop Phased Workflow** — plugins_claudex_loop_skills_claudex_loop_skill_phase_0_recon, plugins_claudex_loop_skills_claudex_loop_skill_phase_1_settle_requirements, plugins_claudex_loop_skills_claudex_loop_skill_phase_2_independent_plan_review, plugins_claudex_loop_skills_claudex_loop_skill_phase_3_build_and_inspect [EXTRACTED 1.00]
- **Stripboard Colour Rules** — design_red_is_the_action_rule, design_folder_colour_rule, design_one_ink_rule, design_color_tokens [EXTRACTED 1.00]
- **Logo brand composition** — plugins_claudex_loop_assets_logo_claudex_wordmark, plugins_claudex_loop_assets_logo_loop_wordmark, plugins_claudex_loop_assets_logo_tagline [EXTRACTED 1.00]
- **Contributor PRs Superseded by PR #16** — plugins_claudex_loop_acknowledgments_pr_11_yaml_frontmatter_fix, plugins_claudex_loop_acknowledgments_pr_13_review_prompt_provenance, plugins_claudex_loop_acknowledgments_pr_15_non_git_plan_reviews, plugins_claudex_loop_acknowledgments_pr_16_bidirectional_workflow [EXTRACTED 1.00]
- **Six-Folder AI Video Studio Workspace** — product_folder_references, product_folder_approved_videos, product_folder_editing_style, product_folder_brand_kit, product_folder_raw, product_folder_exports [EXTRACTED 1.00]
- **First-second hook rules** — social_media_readme_first_second_best_shot, social_media_reel_edit_plans_golden_rule_first_second, social_media_readme_weak_hooks_problem, social_media_viral_swipe_place_only_flops [INFERRED 0.85]
- **Job Strip Signature Interaction (brief, design, page, script)** — _impeccable_surfaces_docs_index_html_signature_interaction, design_lanes_and_job_strip, docs_index_job_section, product_editing_workflow, design_motion_system [INFERRED 0.85]
- **Person-first / Manglish hook strategy driving Reels 5 and 6** — social_media_viral_swipe_person_or_feeling_hook, social_media_viral_swipe_manglish_one_liner, social_media_reel_edit_plans_reel6_kerala_rules_uk_kid [INFERRED 0.85]
- **claudex-loop phased planning workflow** — plugins_claudex_loop_assets_run_phase_0_recon, plugins_claudex_loop_assets_run_phase_1_interrogate, plugins_claudex_loop_assets_run_phase_2_review, plugins_claudex_loop_assets_run_plan_locked [INFERRED 0.85]
- **Five Claude skills that run the video studio** — ai_video_studio_exports_animated_reels_source_pipeline_skills_script_everything_claude_code, ai_video_studio_exports_animated_reels_source_pipeline_skills_script_graphify, ai_video_studio_exports_animated_reels_source_pipeline_skills_script_ig_viral, ai_video_studio_exports_animated_reels_source_pipeline_skills_script_ig_human, ai_video_studio_exports_animated_reels_source_pipeline_skills_script_remotion [EXTRACTED 1.00]
- **Cloned-voice reel production pipeline** — ai_video_studio_exports_animated_reels_notes_chatterbox, ai_video_studio_exports_animated_reels_source_pipeline_voice_gen, ai_video_studio_exports_animated_reels_source_pipeline_tempo, ai_video_studio_exports_animated_reels_source_pipeline_sfx_gen, ai_video_studio_exports_animated_reels_notes_whisper_transcription_check, ai_video_studio_exports_animated_reels_notes_remotion_render [INFERRED 0.85]
- **Reels 5 and 6: script, animation and transcript** — social_media_reel_edit_plans_reel5_kerala_dad_mykonos_spreadsheet, social_media_reel_edit_plans_reel6_kerala_rules_uk_kid, ai_video_studio_exports_animated_reels_notes_mykonos_spreadsheet_animated_v2, ai_video_studio_exports_animated_reels_notes_kerala_rules_animated_v2, graphify_out_transcripts_kerala_rules_animated_v2_9x16_transcript, graphify_out_transcripts_mykonos_spreadsheet_animated_v2_9x16_transcript [INFERRED 0.85]

## Communities (36 total, 4 thin omitted)

### Community 0 - "Voice and Sound Pipeline"
Cohesion: 0.07
Nodes (31): chime(), pop(), whoosh(), display_words(), mouth_from_wav(), main(), matches(), norm() (+23 more)

### Community 1 - "Claudex Runner Code"
Cohesion: 0.08
Nodes (23): finder(), f(), load_words(), main(), validate(), check_approval(), cli_prefix(), codex_effective_settings() (+15 more)

### Community 2 - "Made-by-Claude Reel Code"
Cohesion: 0.09
Nodes (53): Asterisk(), Captions(), Card(), CHAPTERS, Check(), CHIPS, clamp, CODE (+45 more)

### Community 3 - "Animated Reels Code"
Cohesion: 0.10
Nodes (45): Bubble(), C, Canvas(), Captions(), Centre(), clamp, Cross(), ease (+37 more)

### Community 4 - "Claude Skill Setup Reel"
Cohesion: 0.06
Nodes (45): build_timing.py fix reviewed by Codex, Chapter Tracker FOLDER · SKILLS · MAP · REVIEW · READY, Mac repo .claude Folder and Plugins, claude-skill-setup_v1_9x16 (captions only, 30.5 s), claude-skill-setup v2 (in my own voice, 28.8 s), claudex-loop SKILL.md, claude-skill-setup Reel Notes, gen.py + assemble.py voice pipeline (+37 more)

### Community 5 - "Docs Site Design System"
Cohesion: 0.06
Nodes (35): Visitor Mode: Persuade (open the repository), Surface Brief: Landing Page, Action Button Component, Design System: AI Video Studio, Full-Bleed Three-Column Board Grid, Break Strip Component, Closing Panel, Color Tokens (board, card, folder colours, red) (+27 more)

### Community 6 - "Skill Setup Reel Code"
Cohesion: 0.11
Nodes (41): Arrow(), Asterisk(), Cap, Captions(), Card(), CardHead(), chapterOf(), CHAPTERS (+33 more)

### Community 7 - "Viral Swipe Hooks"
Cohesion: 0.06
Nodes (33): Family is first, Works as a nurse (busy schedule), October end-of-season Greece trip, Save, message or comment to get the trip list, Voice recording part 2 (creator self-introduction), Explore at least two places/countries every year, Caption Drafts, Dad & Son Toddler Travel Caption (+25 more)

### Community 8 - "Skills Reel Code"
Cohesion: 0.09
Nodes (36): Arm(), Avatar(), Hand(), Pose, poseAngles(), AvatarTest(), poses, Backdrop() (+28 more)

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
Cohesion: 0.17
Nodes (13): (Dropped) Bonfire night through his eyes, Carousel: Our last morning in Mykonos, Dad gym reel (heart hook), v1-v10, Hotel reel v3 (no hands), Mother's Day 2027 reserved photos, Picsart cinematic versions (LUT grading), Reel 2: Our hotel, reviewed by a toddler, Reel 3: Beach day in Mykonos in October (+5 more)

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
Cohesion: 0.27
Nodes (8): Animated reels: Reel 5 and Reel 6 (notes), Instagram AI info label, Voice normalised to -15 LUFS, made-by-claude animation style, mykonos-spreadsheet_animated_v2_9x16.mp4 (Reel 5 animated), Remotion render (npx remotion render), Transcript: mykonos-spreadsheet_animated_v2_9x16, Reel 5: Kerala dad's Mykonos spreadsheet

### Community 20 - "Real Data Sources"
Cohesion: 0.20
Nodes (6): graphify-out/graph.json (684 nodes, 1,267 links), graphify path Viral Swipe File -> Remotion (6 hops), Humanizer score 87.4 PASS, Social Media/viral-swipe.md, Caption linter + human score, viral-swipe.md

### Community 21 - "Skills Reel Notes"
Cohesion: 0.29
Nodes (8): Avatar.tsx cartoon presenter, claude-skills-studio_v1_9x16 notes, claude-skills-studio_v1_9x16.mp4 (5 Claude skills that run my video studio), Near-black canvas with neon lime glow style, Reference video VID_20261118_220041_323.mp4 (5 Claude skills every beginner needs), skills_report.json per-line Whisper results, SkillsReel composition (SkillsReel.tsx), Voice-driven mouth animation (loudness, spectral centroid)

### Community 22 - "Model Routing"
Cohesion: 0.31
Nodes (10): Live-Tested CLI Compatibility Baseline (Codex 0.153.4 / Claude Code 2.1.261), claudex-route Skill, Choose Role Before Model, GPT-6.1 Sol, GPT-6 Luna, Short Routing Brief, Claudex Loop Validation Record, Claude Fable 5.1 (+2 more)

### Community 23 - "Cloned Voice Pipeline"
Cohesion: 0.25
Nodes (6): Chatterbox voice-cloning model, Tempo speed-up to ~151 wpm, voice.md, voice-recording-bigishbalan.m4a reference recording, Whisper word-for-word transcription check, Mistranscriptions: Coruvano, UK Malo

### Community 24 - "Five Studio Skills"
Cohesion: 0.36
Nodes (9): Everything Claude Code (327 skills, 72 helpers), Graphify (project map, 684 ideas), IG Human (takes the robot out of captions), IG Viral (283x outlier reels), Hook: I'm a nurse. I don't code., Remotion (video as code), Skills reel script (skills_script.txt), Skill-tree map with STUDIO SKILLS n/5 counter (+1 more)

### Community 25 - "Claudex Run Example"
Cohesion: 0.25
Nodes (9): /claudex-loop research=web command, Phase 0 - Recon (assumptions ledger), Phase 1 - Interrogate (decision map), Phase 2 - Review (iterative verdict rounds), Plan locked, PLAN-REVIEW-LOG.md, claudex-loop Run Terminal Illustration (run.svg), VERDICT: APPROVED (+1 more)

### Community 26 - "Reel 6 and Comment CTAs"
Cohesion: 0.29
Nodes (6): kerala-rules_animated_v2_9x16.mp4 (Reel 6 animated), Comment SKILLS call to action, 'Choru venno' heard as 'Coruveno'; 'Mallu' as 'Malu', kerala-rules animated v1 transcript, Transcript: kerala-rules_animated_v2_9x16, Reel 6: Kerala rules, UK kid

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
- **72 isolated node(s):** `'Parents, plan or go, comment below' CTA`, `mykonos-spreadsheet animated v1 transcript`, `Candidly Niya (283x outlier)`, `Homegrown Harvest (weak finding)`, `/ig-reel skill` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 221 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `claude-skills-studio_v1_9x16 notes` connect `Skills Reel Notes` to `Voice and Sound Pipeline`, `Claudex Runner Code`, `Reel Edit Plans`, `Animated Reels Notes`, `Real Data Sources`, `Cloned Voice Pipeline`, `Five Studio Skills`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `'Parents, plan or go, comment below' CTA`, `mykonos-spreadsheet animated v1 transcript`, `Candidly Niya (283x outlier)` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Voice and Sound Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.06821787414066631 - nodes in this community are weakly interconnected._
- **Why does `Reel edit plans: Mykonos & Bonfire footage` connect `Reel Edit Plans` to `Claude Skill Setup Reel`, `Viral Swipe Hooks`, `Animated Reels Notes`, `Skills Reel Notes`, `Reel 6 and Comment CTAs`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `Claudex Runner Code` be split into smaller, more focused modules?**
  _Cohesion score 0.07627118644067797 - nodes in this community are weakly interconnected._
- **Why does `Hotel reel v4 (opens on Mykonos Bay Hotel sign)` connect `Viral Swipe Hooks` to `Reel Edit Plans`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `Made-by-Claude Reel Code` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._