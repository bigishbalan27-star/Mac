# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: static HTML/CSS, one self-contained page with no build step, so it can be hosted from this repository (for example GitHub Pages). The stack question was offered; the owner answered "no preference".

## Users

Inferred, not confirmed (the owner answered "no preference"): solo creators who edit their own videos with AI tools and want a repeatable place to keep footage, style rules and drafts. They arrive curious about how someone else organises AI video editing and whether they can copy it.

## Product Purpose

AI Video Studio is a folder-based workspace for AI video editing, kept in a public GitHub repository. It gives each stage of an edit a fixed home so an AI editor can be handed a job and return drafts in the owner's style. Success for the landing page (inferred): a visitor understands the workflow and opens the repository to copy it.

## Positioning

The studio is not an app. It is six plain folders plus written rules, and the AI editor learns the owner's style from what is in them: approved videos first, references second.

## Operating Context

- Six folders: `References/`, `Approved Videos/`, `Editing Style/`, `Brand Kit/`, `Raw/`, `Exports/`.
- Workflow: `Raw/` → `Exports/` (draft) → `Approved Videos/` (final).
- Each subfolder of `Raw/` is one editing job, with a `notes.md` giving target platform and length, the hook, must-keep moments, cuts and the deadline.
- Drafts in `Exports/` are named after their `Raw/` folder with a version number (`podcast-ep12_v1.mp4`) and a platform suffix (`_9x16`, `_16x9`); an optional `feedback.md` holds review notes.
- Large video files live in Descript or Google Drive with links noted in the repo, because GitHub limits files to 100 MB.

## Capabilities and Constraints

- The repository currently holds only the folder structure and READMEs. No videos, style guide or brand assets have been added.
- Undecided: whether the studio is ever offered as a service or product. Nothing in the repo says so; the page must not imply it.
- Undecided: pricing, contact details, sign-up. None exist.

## Brand Commitments

Name: "AI Video Studio". No logo, colours, fonts or voice have been set.

## Evidence on Hand

- `AI Video Studio/README.md` and the six folder READMEs: the real folder names, their purposes, the workflow and the naming conventions.
- Absent, and not to be fabricated: finished videos, testimonials, user numbers, results claims, named AI tools beyond Descript and Google Drive as storage.

## Product Principles

1. The folders are the product: show them, name them exactly, never rename them for effect.
2. Your approved work outranks anyone else's: edits match Approved Videos before References.
3. Rules are written down, not remembered.
4. Every draft is versioned and reviewed before it is called final.
