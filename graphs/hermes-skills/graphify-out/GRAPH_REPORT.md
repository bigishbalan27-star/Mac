# Graph Report - skills  (2026-11-22)

## Corpus Check
- Large corpus: 2291 files · ~1,871,004 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 1227 nodes · 2444 edges · 54 communities (47 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 84 edges (avg confidence: 0.83)
- Token cost: 705,069 input · 0 output

## Community Hubs (Navigation)
- Word docx scripts
- Maps & arXiv clients
- PowerPoint pptx scripts
- Google Workspace API
- Office & PDF tests
- Word docx tests
- Office shared helpers
- Document action items
- Apple Notes & coding agents
- Hermes home & paths
- Workspace secure storage
- Grounded citation sources
- Code review & cleanup
- Manim & p5.js creative
- PowerPoint tests
- Messaging & monitors
- Hermes Agent theming
- Excel restructure script
- Computer use & QA
- Spikes, TDD & debugging
- Word docx reader
- Diagrams & Claude Design
- PDF form filling
- p5.js frame export
- Marker extraction & YouTube
- Humanizer writing patterns
- Blocked-page recovery
- Competitor news monitor
- Popular web designs
- Songwriting & AI music
- ASCII video pipeline
- Citation hierarchy
- PDF form layout
- arXiv research
- Teams meeting pipeline
- xurl X/Twitter CLI
- Infographic generator
- Weekly review planning
- PyMuPDF extraction
- Hermes desktop plugins
- PDF creation
- PDF form builder
- PDF stamping
- GitHub credential helper
- p5.js setup script
- PDF page images
- PDF splitting
- YouTube transcripts
- Manim setup script
- Obsidian notes
- Hermes clock plugin
- GitHub env script
- p5.js render script
- p5.js serve script

## God Nodes (most connected - your core abstractions)
1. `_run_gws()` - 30 edges
2. `run()` - 28 edges
3. `_gws_binary()` - 27 edges
4. `build_service()` - 27 edges
5. `main()` - 26 edges
6. `run()` - 26 edges
7. `Hermes p5.js Skill` - 25 edges
8. `colors` - 23 edges
9. `run()` - 23 edges
10. `Claude Code Hermes Orchestration skill` - 19 edges

## Surprising Connections (you probably didn't know these)
- `Extraction with Provenance` --semantically_similar_to--> `Citation Ledger (url -> [n])`  [INFERRED] [semantically similar]
  hermes-document-to-action-items/SKILL.md → hermes-grounded-citations/SKILL.md
- `CONCEPT-DESIGN-CODE-PREVIEW-EXPORT-VERIFY pipeline` --semantically_similar_to--> `PLAN-CODE-RENDER-STITCH-AUDIO-REVIEW pipeline`  [INFERRED] [semantically similar]
  hermes-p5js/SKILL.md → hermes-manim-video/SKILL.md
- `Reviewer/Implementer Role Separation` --semantically_similar_to--> `Independent Reviewer Subagent`  [INFERRED] [semantically similar]
  hermes-sdlc-review/SKILL.md → hermes-requesting-code-review/SKILL.md
- `Apple Reminders skill` --semantically_similar_to--> `Apple Notes skill`  [INFERRED] [semantically similar]
  hermes-apple-reminders/SKILL.md → hermes-apple-notes/SKILL.md
- `Provenance discipline (snapshot vs live)` --semantically_similar_to--> `arXiv ID versioning and citation drift`  [INFERRED] [semantically similar]
  hermes-blocked-page-recovery/SKILL.md → hermes-arxiv/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Blocked-page recovery ladder routes** — hermes_blocked_page_recovery_skill_wayback_machine, hermes_blocked_page_recovery_skill_archive_today, hermes_blocked_page_recovery_skill_jina_reader, hermes_blocked_page_recovery_skill_api_first_pivot [EXTRACTED 1.00]
- **ASCII video render pipeline stages** — hermes_ascii_video_skill_six_stage_pipeline, hermes_ascii_video_skill_tonemap, hermes_ascii_video_skill_shaderchain, hermes_ascii_video_skill_ffmpeg [EXTRACTED 1.00]
- **Claude Design anti-slop method** — hermes_claude_design_skill_surface_first, hermes_claude_design_skill_slop_diagnostic, hermes_claude_design_skill_anti_slop_rules, hermes_claude_design_skill_design_workflow [INFERRED 0.85]
- **Approval-gated external mutations** — hermes_email_inbox_triage_skill_approval_batch, hermes_document_to_action_items_skill_review_before_writes, hermes_google_workspace_skill_confirm_before_write_rule, hermes_computer_use_skill_safety_rules [INFERRED 0.85]
- **Source provenance and evidence discipline** — hermes_grounded_citations_skill_citation_ledger, hermes_document_to_action_items_skill_provenance_extraction, hermes_competitor_news_monitor_skill_source_hierarchy, hermes_grounded_citations_skill_verbatim_quote_evidence [INFERRED 0.75]
- **Email triage over connector skills** — hermes_email_inbox_triage_skill, hermes_himalaya_skill, hermes_google_workspace_skill [EXTRACTED 1.00]
- **Document skills sharing the pinned Hermes documents environment** — hermes_microsoft_office_skill, hermes_pdf_skill, hermes_microsoft_office_skill_hermes_docs_env, hermes_pdf_skill_hermes_docs_env [EXTRACTED 1.00]
- **Programmatic visual media pipelines (plan, code, render, export via ffmpeg)** — hermes_manim_video_skill_pipeline, hermes_p5js_skill_pipeline, hermes_manim_video_skill_ffmpeg, hermes_p5js_skill_ffmpeg, hermes_manim_video_skill_first_render_excellence, hermes_p5js_skill_first_render_excellence [INFERRED 0.85]
- **Humanizer AI writing pattern families** — hermes_humanizer_skill_content_patterns, hermes_humanizer_skill_language_grammar_patterns, hermes_humanizer_skill_style_patterns, hermes_humanizer_skill_communication_patterns, hermes_humanizer_skill_filler_and_hedging, hermes_humanizer_skill_rhythm_rhetoric_patterns [EXTRACTED 1.00]
- **Independent review / quality-gate skills** — hermes_requesting_code_review_skill, hermes_simplify_code_skill, hermes_sdlc_review_skill, hermes_test_driven_development_skill [INFERRED 0.85]
- **Skills fanning out work via delegate_task** — hermes_requesting_code_review_skill_delegate_task, hermes_simplify_code_skill_delegate_task_batch_mode, hermes_spike_skill_delegate_task, hermes_systematic_debugging_skill_delegate_task, hermes_test_driven_development_skill_delegate_task, hermes_sdlc_review_skill_delegate_task [INFERRED 0.85]
- **Systematic debugging phase flow** — hermes_systematic_debugging_skill_tight_feedback_loop, hermes_systematic_debugging_skill_minimize_reproduction, hermes_systematic_debugging_skill_ranked_falsifiable_hypotheses, hermes_systematic_debugging_skill_rule_of_three [EXTRACTED 1.00]

## Communities (54 total, 7 thin omitted)

### Community 0 - "Word docx scripts"
Cohesion: 0.05
Nodes (42): add_comment_native(), add_comment_xml(), _anchored_texts(), _comments_root(), delete_comment(), find_anchor_runs(), list_comments(), main() (+34 more)

### Community 1 - "Maps & arXiv clients"
Cohesion: 0.06
Nodes (36): search(), _fetch(), _fetch_follow(), main(), _page_title(), recover(), try_archive_today(), try_jina() (+28 more)

### Community 2 - "PowerPoint pptx scripts"
Cohesion: 0.06
Nodes (33): add_bullets(), build_slide(), copy_layout_placeholder(), main(), set_slide_title(), style_run(), add_hyperlink(), _copy_layout_placeholder() (+25 more)

### Community 3 - "Google Workspace API"
Cohesion: 0.10
Nodes (42): build_service(), calendar_create(), calendar_delete(), calendar_list(), contacts_list(), _datetime_with_timezone(), docs_append(), docs_create() (+34 more)

### Community 4 - "Office & PDF tests"
Cohesion: 0.10
Nodes (46): restructure_book(), run(), test_csv_roundtrip_nonascii(), test_edit_existing(), test_help_and_errors(), test_names_hyperlinks_notes(), test_read_sheets_json_formulas(), test_recalc_reports_json_both_ways() (+38 more)

### Community 5 - "Word docx tests"
Cohesion: 0.08
Nodes (17): _add_del(), _add_ins(), created(), make_png(), q(), run(), run_raw(), TestComments (+9 more)

### Community 6 - "Office shared helpers"
Cohesion: 0.06
Nodes (28): get_token_path(), get_valid_token(), main(), _normalize_authorized_user_payload(), refresh_token(), infer(), main(), add_chart() (+20 more)

### Community 7 - "Document action items"
Cohesion: 0.05
Nodes (40): Document to Action Items Skill, Evidence Classification, Proposed Actions (unresolved owners/dates never invented), Email Inbox Triage Skill, Thread Dispositions (urgent reply, reply, action, waiting, reference, noise), Google Workspace Skill, references/daily-brief.md, references/gmail-search-syntax.md (+32 more)

### Community 8 - "Apple Notes & coding agents"
Cohesion: 0.05
Nodes (39): Apple Notes skill, memo CLI, Apple Notes.app (iCloud sync), Apple Reminders skill, EventKit EKReminder / EKCalendarItem, remindctl CLI, Claude Code Hermes Orchestration skill, --bare mode for CI (+31 more)

### Community 9 - "Hermes home & paths"
Cohesion: 0.07
Nodes (21): display_hermes_home(), get_hermes_home(), get_hermes_home(), find_tools(), main(), render(), count_cached(), main() (+13 more)

### Community 10 - "Workspace secure storage"
Cohesion: 0.08
Nodes (16): write_private_json(), check_auth(), check_auth_live(), _ensure_deps(), exchange_auth_code(), _extract_code_and_state(), get_auth_url(), install_deps() (+8 more)

### Community 11 - "Grounded citation sources"
Cohesion: 0.10
Nodes (20): add_sources(), attach_quote(), _by_url(), _LedgerLock, load_ledger(), main(), _match_key(), normalize_url() (+12 more)

### Community 12 - "Code review & cleanup"
Cohesion: 0.07
Nodes (31): Codebase Inspection Skill (pygount), pygount Pseudo-Languages (__empty__, __binary__, __generated__, __duplicate__, __unknown__), pygount, pygount Summary Format, GitHub Skill (gh CLI), references/auth.md, references/code-review.md, gh CLI (+23 more)

### Community 13 - "Manim & p5.js creative"
Cohesion: 0.07
Nodes (29): Hermes Manim Video Skill, Assumption Reversal, Manim color palettes (Classic 3B1B, Warm academic, Neon tech, Monochrome), ffmpeg (scene stitching, audio muxing), LaTeX (MathTex rendering), Manim Community Edition, PLAN-CODE-RENDER-STITCH-AUDIO-REVIEW pipeline, SCAMPER creative transformation (+21 more)

### Community 14 - "PowerPoint tests"
Cohesion: 0.12
Nodes (28): deck(), run(), run_raw(), sample_png(), test_chart_op_unknown_series_fails(), test_chart_surgical_ops(), test_create_43_size(), test_create_and_outline() (+20 more)

### Community 15 - "Messaging & monitors"
Cohesion: 0.08
Nodes (22): Hermes iMessage Skill, Full Disk Access / Automation permission, imsg CLI (steipete/tap/imsg), macOS Messages.app, Hermes Maps Skill, find-nearby (superseded skill), maps_client.py, nearby command (POI search) (+14 more)

### Community 16 - "Hermes Agent theming"
Cohesion: 0.06
Nodes (30): branding, agent_name, help_header, prompt_symbol, colors, background, banner_accent, banner_border (+22 more)

### Community 17 - "Excel restructure script"
Cohesion: 0.14
Nodes (8): main(), RefRewriter, _rewrite_formulas(), shift_dimensions(), _shift_freeze_panes(), shift_point(), shift_range(), shift_span()

### Community 18 - "Computer use & QA"
Cohesion: 0.12
Nodes (19): Computer Use Skill, browser_exec Tool, capture Action (som/vision/ax modes), hermes computer-use doctor, computer_use Tool, cua-driver, cua-driver Skill Pack, Dogfood Web App QA Skill (+11 more)

### Community 19 - "Spikes, TDD & debugging"
Cohesion: 0.10
Nodes (18): Hermes Spike Skill, Comparison Spikes (head-to-head), delegate_task, Frontier Mode, Given/When/Then Spike Framing, gsd-spike / GSD (Get Shit Done), Spike Core Loop (decompose, research, build, verdict), Spike Verdict (VALIDATED / PARTIAL / INVALIDATED) (+10 more)

### Community 20 - "Word docx reader"
Cohesion: 0.16
Nodes (13): append_part_text(), cell_text(), detect_revisions(), extract_images(), extract_structure(), extract_text(), main(), styles_used() (+5 more)

### Community 21 - "Diagrams & Claude Design"
Cohesion: 0.11
Nodes (10): Architecture Diagram skill, Cocoon AI architecture-diagram-generator, templates/template.html, Claude Design for CLI/API Agents skill, Deck rules (1920x1080 fixed canvas), design-md skill (DESIGN.md token spec), Design workflow (brief→context→surface→system→format→build→verify→report), popular-web-designs skill (+2 more)

### Community 22 - "PDF form filling"
Cohesion: 0.17
Nodes (5): main(), main(), main(), main(), main()

### Community 23 - "p5.js frame export"
Cohesion: 0.18
Nodes (11): apparmorRestrictsUserns(), chromeArgs(), fs, main(), MIME_TYPES, parseArgs(), path, resolveLocalFile() (+3 more)

### Community 24 - "Marker extraction & YouTube"
Cohesion: 0.18
Nodes (5): check_requirements(), extract_video_id(), fetch_transcript(), format_timestamp(), main()

### Community 25 - "Humanizer writing patterns"
Cohesion: 0.23
Nodes (11): Hermes Humanizer Skill, 34 AI Writing Patterns catalog, blader/humanizer upstream repo, Communication Patterns (chatbot artifacts, cutoff disclaimers, sycophancy), Content Patterns (significance inflation, promotional language, vague attributions), Filler and Hedging Patterns, Language and Grammar Patterns (AI vocabulary, copula avoidance, rule of three), Style, Rhythm, and Rhetoric Patterns (forced metaphors, punchy kickers, reassurance kickers) (+3 more)

### Community 26 - "Blocked-page recovery"
Cohesion: 0.20
Nodes (7): Blocked-Page Recovery skill, archive.today domain rotation, grounded-citations skill, Jina Reader (requires JINA_API_KEY), scripts/recover_page.py, Recovery ladder (Wayback→archive.today→Jina→API pivot→browser), Wayback Machine (available API, CDX)

### Community 27 - "Competitor news monitor"
Cohesion: 0.23
Nodes (10): Competitor News Monitor Skill, blogwatcher Skill, competitor-watch Automation Blueprint, cronjob Tick Run, Materiality Assessment, reddit-reading Skill, rss-feeds Skill, Watch Contract (watchlist, categories, materiality threshold, cutoff) (+2 more)

### Community 28 - "Popular web designs"
Cohesion: 0.23
Nodes (11): Hermes Popular Web Designs Skill, VoltAgent/awesome-design-md, browser_exec capture_screenshot verification, claude-design (related skill), 54 design system templates catalog, design-md (related skill), generative-widgets (cloudflared tunnel serving), Hermes Implementation Notes block (+3 more)

### Community 29 - "Songwriting & AI music"
Cohesion: 0.22
Nodes (10): Hermes Songwriting & AI Music Skill, audiocraft (MusicGen / AudioGen), heartmula (open-source Suno alternative), Parody and Adaptation (syllable/stress skeleton mapping), Phonetic Tricks for AI Singers, Prosody, Rhyme Types and Meter, Song Structure Skeletons (ABABCB, AABA, ABAB, AAA) (+2 more)

### Community 30 - "ASCII video pipeline"
Cohesion: 0.29
Nodes (8): ASCII Video Production Pipeline skill, Creative divergence strategies (Forced Connections, Conceptual Blending, Oblique Strategies), ElevenLabs TTS API, ffmpeg encoder (pipe deadlock caveat), ASCII video modes (video-to-ASCII, audio-reactive, generative, hybrid, lyrics, TTS), ShaderChain + FeedbackBuffer, 6-stage pipeline INPUT→ANALYZE→SCENE_FN→TONEMAP→SHADE→ENCODE, Adaptive percentile tonemap()

### Community 31 - "Citation hierarchy"
Cohesion: 0.31
Nodes (8): Source Coverage Hierarchy, Grounded Citations Skill, references/citation-formats.md, Cite-While-Drafting, Fact-Checking Mode, scripts/sources.py, [unverified] Marker, sources.py verify (--strict, --min-coverage, --evidence)

### Community 32 - "PDF form layout"
Cohesion: 0.36
Nodes (7): _box_gap(), _boxes_overlap(), _check_box(), main(), _page_size(), render_overlay(), validate()

### Community 33 - "arXiv research"
Cohesion: 0.31
Nodes (9): arXiv Research skill, arXiv export API (Atom XML), BibTeX generation from arXiv metadata, ocr-and-documents skill, Complete research workflow (discover, assess, read, related, track), scripts/search_arxiv.py helper, arXiv search query prefixes and boolean operators, Semantic Scholar API (+1 more)

### Community 34 - "Teams meeting pipeline"
Cohesion: 0.33
Nodes (7): Hermes Teams Meeting Pipeline Skill, Delivery Mode Config (platforms.teams.extra.delivery_mode), Graph Webhook Subscriptions, hermes teams-pipeline CLI, Meeting Job Replay (run <job-id>), Microsoft Graph, MSGRAPH_TENANT_ID / CLIENT_ID / CLIENT_SECRET

### Community 35 - "xurl X/Twitter CLI"
Cohesion: 0.31
Nodes (8): Hermes xurl Skill (X API via Official CLI), Default App Profile Pitfall, Docker HOME Pitfall (/opt/data/home), OAuth 2.0 PKCE Auth (xurl auth oauth2 --app), Raw X API v2 Endpoint Access, xitter (replaced skill), xurl CLI, Output Formats (Chapters, Summary, Thread, Blog, Quotes)

### Community 36 - "Infographic generator"
Cohesion: 0.32
Nodes (7): Infographic Generator skill (baoyu-infographic), JimLiu baoyu-skills repository, image_generate tool (landscape/portrait/square), Keyword shortcuts (信息图, 高密度信息大图), Layout gallery (21 layouts, default bento-grid), 7-step infographic workflow (analyze→structure→recommend→confirm→prompt→generate→summary), Style gallery (21 styles, default craft-handmade)

### Community 37 - "Weekly review planning"
Cohesion: 0.25
Nodes (6): Hermes Weekly Review and Planning Skill, email-inbox-triage skill, google-workspace skill, obsidian skill, weekly-review Automation Blueprint (cron), Weekly Review Procedure (7 steps)

### Community 39 - "Hermes desktop plugins"
Cohesion: 0.47
Nodes (3): MyChip(), MyPane(), register()

### Community 40 - "PDF creation"
Cohesion: 0.47
Nodes (3): build_pdf(), main(), _reconfigure_stdio()

### Community 41 - "PDF form builder"
Cohesion: 0.53
Nodes (4): build_form(), main(), _page_size(), _reconfigure_stdio()

### Community 42 - "PDF stamping"
Cohesion: 0.60
Nodes (3): build_overlay(), main(), parse_pages()

### Community 43 - "GitHub credential helper"
Cohesion: 0.60
Nodes (3): _decode(), main(), _token_from_url()

### Community 44 - "p5.js setup script"
Cohesion: 0.60
Nodes (3): ok(), setup.sh script, warn()

### Community 47 - "YouTube transcripts"
Cohesion: 0.60
Nodes (5): Hermes YouTube Content Skill, fetch_transcript.py, pm.sync_venv youtube extra, Transcript Chunking (~40K with 2K overlap), youtube_transcript_api

### Community 48 - "Manim setup script"
Cohesion: 0.83
Nodes (3): fail(), ok(), setup.sh script

### Community 49 - "Obsidian notes"
Cohesion: 0.50
Nodes (3): Hermes Obsidian Skill, OBSIDIAN_VAULT_PATH convention, Obsidian [[wikilinks]]

## Knowledge Gaps
- **108 isolated node(s):** `NousResearch hermes-agent repository`, `Apple Notes.app (iCloud sync)`, `EventKit EKReminder / EKCalendarItem`, `Cocoon AI architecture-diagram-generator`, `templates/template.html` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 420 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `run()` connect `Word docx tests` to `Hermes home & paths`, `Office & PDF tests`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `NousResearch hermes-agent repository`, `Apple Notes.app (iCloud sync)`, `EventKit EKReminder / EKCalendarItem` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Word docx scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05333333333333334 - nodes in this community are weakly interconnected._
- **Why does `main()` connect `Excel restructure script` to `Office & PDF tests`, `PDF form filling`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Should `Maps & arXiv clients` be split into smaller, more focused modules?**
  _Cohesion score 0.055905220288781934 - nodes in this community are weakly interconnected._
- **Why does `run()` connect `PowerPoint tests` to `Hermes home & paths`, `Office & PDF tests`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Should `PowerPoint pptx scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05792349726775956 - nodes in this community are weakly interconnected._