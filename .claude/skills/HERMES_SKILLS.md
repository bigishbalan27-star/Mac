# Hermes skills

The 44 core skills from [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) `skills/` at commit `c7a3fe24` (MIT licence, Copyright (c) 2025 Nous Research; a copy is in each skill folder).

- Each skill is in `.claude/skills/hermes-<name>/`, and its `name:` field is changed to `hermes-<name>` so it doesn't clash with existing skills (for example `humanizer`, `manim-video`, `pdf`). Nothing else is changed.
- They were written for the Hermes Agent runtime. Some refer to Hermes-only tools or paths (`HERMES_HOME`, `delegate_task`, `send_message`, the `hermes` CLI), mainly `hermes-hermes-agent`, `hermes-teams-meeting-pipeline`, `hermes-computer-use`, `hermes-microsoft-office`, `hermes-google-workspace` and `hermes-requesting-code-review`. In Claude Code, use the closest equivalent tool or skip those steps.
- Several need CLIs that aren't installed by default (`memo`, `remindctl`, `imsg`, `himalaya`, `xurl`, `gws`, `pygount`, `manim`). The Apple skills only work on macOS.
- To update: clone the repo, then rerun the copy (one folder per `skills/<category>/<skill>`, prefixed `hermes-`).
