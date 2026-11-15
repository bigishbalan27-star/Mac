---
name: AI Video Studio
description: A film production stripboard for a six-folder AI video editing workspace.
colors:
  red: "#c9341f"
  red-deep: "#a82a18"
  on-red: "#ffffff"
  blue: "#8dbbe8"
  green: "#86c990"
  pink: "#f3a3b8"
  yellow: "#f4c935"
  orange: "#f2924a"
  card: "#f5f5f1"
  board: "#1b1a18"
  break: "#0b0b0a"
  rail: "#a8a9a5"
  rail-dim: "#55554f"
  ink: "#16140f"
  ink-soft: "#33342f"
  on-board: "#f5f5f1"
  on-board-soft: "#c6c6bf"
typography:
  display:
    fontFamily: "Sofia Sans Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(3.25rem, 7.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Sofia Sans Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 5.4vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.92
  title:
    fontFamily: "Sofia Sans Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.01em"
  figure:
    fontFamily: "Sofia Sans Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 5.6vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "0em"
  statement:
    fontFamily: "Sofia Sans Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(1.875rem, 3.2vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1
  action:
    fontFamily: "Sofia Sans Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.03em"
  label:
    fontFamily: "Sofia Sans Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    letterSpacing: "0.06em"
  lede:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  cell:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  none: "0"
  action: "2px"
spacing:
  strip-gap: "3px"
  rail: "3px"
  cell: "1.5rem"
  gutter: "clamp(1.25rem, 4vw, 4rem)"
  head-gap: "2.5rem"
  panel-top: "clamp(4.5rem, 10vw, 8rem)"
  panel-bottom: "clamp(3.5rem, 8vw, 6.5rem)"
components:
  button-action:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
    typography: "{typography.action}"
    rounded: "{rounded.action}"
    padding: "0.95rem 1.25rem 0.95rem 1.4rem"
  button-action-hover:
    backgroundColor: "{colors.red-deep}"
    textColor: "{colors.on-red}"
  button-action-on-red:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.action}"
    padding: "0.95rem 1.25rem 0.95rem 1.4rem"
  button-action-on-red-hover:
    backgroundColor: "{colors.on-red}"
    textColor: "{colors.ink}"
  break-strip:
    backgroundColor: "{colors.break}"
    textColor: "{colors.on-board}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  nav-break:
    backgroundColor: "{colors.break}"
    textColor: "{colors.on-board-soft}"
    typography: "{typography.label}"
    height: "3.25rem"
  nav-repo:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
    typography: "{typography.label}"
    padding: "0 1.25rem"
  nav-repo-hover:
    backgroundColor: "{colors.red-deep}"
  header-strip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
  folder-strip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    height: "3.6rem"
  lane-name:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.25rem"
  lane-slot:
    backgroundColor: "{colors.break}"
    height: "6.5rem"
  job-strip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.5rem"
  tab:
    backgroundColor: "{colors.green}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.85rem 0.35rem"
  tab-white:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
  field-cell:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    padding: "1.4rem 1.25rem 1.6rem"
  filename-segment:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
    padding: "1.25rem 1.25rem 1.5rem"
  closing-panel:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
---

# Design System: AI Video Studio

## Overview

**Creative North Star: "The Production Stripboard"**

The interface is a film production stripboard: a warm black vinyl board, thin aluminium rails, and matte card strips laid edge to edge. Every piece of content is a strip or a cell on a strip. A strip has a colour that says which folder it belongs to, a name in extra-condensed capitals, and fields separated by hairline rules. Black break strips with white capitals divide the board into groups. Nothing floats, nothing glows, nothing is rounded into a card.

Density is that of a working board rather than a brochure: full-width rows, 3px of board showing between strips, text set close to its rule. Space is spent between sections, not inside strips. The page alternates the dark board and a single off-white card surface, and ends on one red panel that holds the action.

The system was written to refuse the dark gradient product page with a glowing timeline mock-up. It has no gradients, no imagery, and no raster assets; the board itself is the picture.

**Key Characteristics:**
- One material: flat matte strips on a near-black board, separated by 3px gaps and 3px aluminium rails.
- Six card colours, one per folder, always with the same dark ink on top.
- Red means the action and nothing else.
- Extra-condensed capitals name things; a plain humanist sans explains them.
- Hairline rules divide a strip into fields, the way a real strip is ruled.
- Motion deals strips onto the board; it never decorates.

## Colors

Six matte card colours on a warm black board, with red held back for the action.

### Primary
- **Slate Red** (`red`): the action. The action button, the repository cell at the right end of the navigation strip, the closing action panel, the job strip's progress line, and the text caret.
- **Slate Red, Pressed** (`red-deep`): the hover state of any red control.
- **Chalk on Red** (`on-red`): text and the top rule on red. Also the hover fill of the inverted action button. In the stylesheet this is a literal, not a custom property.

### Secondary
The folder colours. Each is bound to one folder and keeps that meaning everywhere it appears (strip, lane name, tab, filename segment).
- **Reference Blue** (`blue`): References.
- **Approved Green** (`green`): Approved Videos.
- **Brand Pink** (`pink`): Brand Kit.
- **Raw Yellow** (`yellow`): Raw. Also the focus outline on dark surfaces, the text selection, and the skip link.
- **Export Orange** (`orange`): Exports.
- **Card White** (`card`): Editing Style, and the default strip. See Neutral.

### Neutral
- **Vinyl Black** (`board`): the page background and the dark panels.
- **Break Black** (`break`): break strips, the navigation strip, the footer, and empty lane slots. One step darker than the board so a break reads as a strip, not a hole.
- **Aluminium** (`rail`): 3px rails above and below a set of strips, and under the navigation strip.
- **Aluminium, Shaded** (`rail-dim`): the scrollbar thumb only.
- **Strip Ink** (`ink`): all text on any card colour; the 2px rule at the top of a ruled list; the fill of the white-folder tab.
- **Soft Ink** (`ink-soft`): supporting text on a card surface (lede, action note, descriptions). A literal in the stylesheet, not a custom property.
- **Chalk** (`on-board`): primary text on the board and on break strips. Same value as Card White.
- **Chalk, Soft** (`on-board-soft`): supporting text on the board: section intros, legend, nav links at rest, notes.
- **Field Hairline**: Strip Ink at 40% opacity, 1px. The rule between fields on a strip.

### Named Rules
**The Red Is The Action Rule.** Red appears only where the visitor acts or where the action is in progress: the action button, the repository cell, the closing panel, the job's progress line. It is never a folder colour, never an accent on a heading, never a status.

**The Folder Colour Rule.** A card colour names a folder. Blue is References, green is Approved Videos, white is Editing Style, pink is Brand Kit, yellow is Raw, orange is Exports. A colour is never reused for decoration or for a second meaning.

**The One Ink Rule.** Every card colour carries Strip Ink text. The six colours were chosen light enough for it; no strip takes white text.

## Typography

**Display Font:** Sofia Sans Extra Condensed (with Arial Narrow, sans-serif), self-hosted variable weight
**Body Font:** Sofia Sans (with system-ui, sans-serif), self-hosted variable weight
**Code Font:** the platform monospace stack (ui-monospace, SFMono-Regular, Menlo, Consolas) at 0.9em, never wrapped, for folder and file names inside running text

**Character:** Tall, tight capitals that read like marker lettering on a strip, paired with a plain humanist sans from the same family for everything a visitor has to actually read. One family, two widths, so the contrast is in proportion rather than in style.

### Hierarchy
- **Display** (800, clamp(3.25rem, 7.4vw, 6rem), 0.9, -0.01em, uppercase, balanced, max 13em): the page headline on the header strip. The closing panel's heading borrows this scale (clamp(3.5rem, 9vw, 6rem)).
- **Headline** (800, clamp(2.75rem, 5.4vw, 4.5rem), 0.92, uppercase, balanced, max 16em): section headings on panels.
- **Title** (800, 2.25rem, 1, 0.01em, uppercase): the name on a strip. Lane names (1.875rem) and field names (2rem) are the same role at the size their cell allows.
- **Figure** (800, clamp(2.5rem, 5.6vw, 5rem), 0.9, real case): literal file names and numbers shown large. The job strip's file line uses the same role at clamp(1.75rem, 3.2vw, 2.5rem); step numerals at 3rem with tabular figures.
- **Statement** (700, clamp(1.875rem, 3.2vw, 2.75rem), 1, sentence case): a one-line claim beside a tab in a ruled list.
- **Action** (700, 1.5rem, 1, 0.03em, uppercase): the action button and folder tabs (tabs at 800).
- **Label** (700, 1.125rem, 0.06em, uppercase): break strips, navigation, footer. The step counter uses it at 1.25rem with tabular figures.
- **Lede** (400, 1.1875rem, 1.5, max 62ch): the paragraph under the display headline. Section intros sit at 1.125rem, max 60ch.
- **Body** (400, 1.0625rem, 1.5; 1rem below 44rem): default reading text. Line length capped between 34ch and 70ch depending on the cell.
- **Cell** (400, 1rem, 1.35): text inside a strip's field, where rows must stay short.

### Named Rules
**The Capitals Name, Sentences Explain Rule.** Extra-condensed capitals are for the name of a thing on the board: a folder, a section, a field, an action. Anything that explains is Sofia Sans in sentence case. Condensed type never runs past one or two lines.

**The Exact Name Rule.** A literal file or folder name keeps its real case and punctuation, even at figure size (`podcast-ep12`, `_9x16`, `Raw/2026-11-podcast-ep12/`). Uppercasing is for labels, never for something the visitor will type.

## Layout

Full-bleed rows. Every strip, break, panel and the navigation run edge to edge; content is inset by one gutter (`gutter`, 1.25rem to 4rem). There is no centred max-width container; line length is controlled per element in `ch`.

The board is a three-column grid: a name column (22%, never under 13rem) and two equal field columns. The legend, the group break strips and the folder strips all share that grid, so names and fields align down the whole board. Strips stack with a 3px gap of board between them and a 3px rail closing the set. Fields are inset 1.5rem from their hairline.

Sets of cells elsewhere reuse the same construction: lanes are a name cell (22%, min 9rem) plus a slot with 3px gaps; the ruled list is a tab column (22%, min 11rem) plus a text column; five equal field cells; four filename segments at 2.4 / 1.1 / 1.5 / 1.1.

Panels have generous vertical padding (4.5rem to 8rem top, 3.5rem to 6.5rem bottom), a heading block with 1rem between heading and intro, and 2.5rem before the strips.

Responsive behaviour:
- **Below 60rem:** the header strip stacks; in-page section links leave the navigation strip, which keeps the brand and the repository cell; five field cells become two columns with the last spanning; filename segments go two by two; numbered steps stack.
- **Below 44rem:** every strip becomes a single column. The board's legend is removed and each field instead shows its own label ("Goes in", "Used for") in a 4.6rem label column, in condensed capitals at 1.0625rem. Lanes stack name over slot, and empty slots keep a 7.5rem height so the job has somewhere to land.

## Elevation & Depth

Flat. Strips are matte card lying on the board; depth is carried by value (board, break, card) and by the 3px gaps and rails, not by shadow. Two things are lifted, because both are things the visitor moves:

### Shadow Vocabulary
- **Action lift** (`box-shadow: 0 6px 14px -6px rgb(0 0 0 / 0.55)`): the action button at rest. Hover raises it 2px and deepens to `0 10px 18px -8px rgb(0 0 0 / 0.6)`; pressed drops it 1px to `0 2px 6px -3px rgb(0 0 0 / 0.6)`.
- **Loose strip** (`box-shadow: 0 8px 18px -8px rgb(0 0 0 / 0.7)`): the one job strip that travels between lanes.

### Named Rules
**The Only What Moves Is Lifted Rule.** A shadow means "this can be picked up": the action button and the travelling job strip. Fixed strips, panels, tabs and cells never take one.

## Shapes

Square. Strips, breaks, cells, tabs, lanes and panels all have 0 radius, cut like card. The action button alone has a 2px radius, enough to read as a pressed key rather than a strip.

Lines come in three weights and each has one job: 3px Aluminium rails close a set of strips; a 2px rule in the surface's text colour opens a ruled list; 1px Field Hairlines separate fields within a strip. Gaps between strips are 3px of bare board, never a drawn border. The arrow in the action button is a 24px stroked glyph, 2.25 stroke, square caps.

## Components

### Buttons
One button: the action. Square-shouldered, heavy, and the only red control.
- **Shape:** 2px radius, padding 0.95rem 1.25rem 0.95rem 1.4rem, label plus a trailing arrow with 0.85rem between.
- **Primary:** Slate Red fill, Chalk on Red text, Action type, Action lift shadow.
- **Hover / Active:** fill goes to Slate Red, Pressed; the button rises 2px and the arrow slides 4px right (160ms and 200ms, ease-out). Pressing sets it down 1px.
- **On red:** inside the closing panel the same button inverts to Card White with Strip Ink text, hover pure white.
- **Focus:** 3px outline, 3px offset. Raw Yellow on the board, Strip Ink on card and strips, Card White on red.
- **Label:** always says what happens next, in full ("Open the repo on GitHub", "Hand the job to the editor").

### Navigation
A break strip, sticky at the top, 3.25rem tall, with a 3px Aluminium rail under it. Brand at the left in Label type at 1.375rem; section links in Chalk, Soft that turn Chalk and underline on hover; a full-height Slate Red cell flush to the right edge carrying the repository action. Below 60rem the section links are removed.

### Break Strips
Break Black, Chalk capitals in Label type. Used to divide groups of strips ("Style", "Jobs", each with a quieter description in the field columns), for the board's column legend, and for the footer.

### Strips (signature)
The unit of the system. A full-width row in a folder colour with Strip Ink text: the name in Title type in the first column, then fields in Cell type, each field opened by a Field Hairline and inset 1.5rem. Minimum height 3.6rem. The header strip is the same material at display scale: Card White, the headline and lede at left, the action at the right end.

### Lanes and the Job Strip (signature)
Three lanes, each a folder-coloured name cell and a Break Black slot, bounded by rails. One loose Card White strip, with the Loose strip shadow, sits in a slot and carries a file name (Figure type) and one line of explanation. A single action button under the lanes names the next move and a step counter sits beside it. Moving the strip to another lane is a 520ms view transition. While the strip is playing by itself a 3px Slate Red line fills along its bottom edge for each beat; the first press of the button ends the self-play for good.

### Tabs
A folder's name as a small flat chip: folder colour, Strip Ink, condensed capitals at 1.5rem, padding 0.4rem 0.85rem 0.35rem, square. The white folder's tab inverts to Strip Ink with Card White text so it stays visible on a card surface. Tabs are not interactive.

### Ruled List
On a card surface: a 2px Strip Ink rule on top, then rows separated by hairlines, each with a tab in the first column and a Statement plus a body paragraph in the second, 1.75rem above and 2rem below.

### Field Cells and Filename Segments
A single strip cut into equal cells by Field Hairlines, each with a field name in Title type over one line of Cell text. The filename is the same idea with separate strips: each part of a file name on the colour of the folder it comes from, in Figure type, with its meaning underneath.

### Closing Panel
A full-width Slate Red panel: display-scale heading, a 2px white rule, three numbered steps in three columns (numerals in condensed 3rem), then the inverted action button with one line of practical advice.

### Motion
One curve, exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`), and three entrances that all work by clipping, never by fading: strips are **dealt** in from the right (720ms, 70 to 80ms apart), cells **drop** in from above (620ms), and headings and numbered steps **rise** through a clip (800 to 900ms). Rules draw from the left (900ms). Each element enters once, when it scrolls into view. All of it is switched on by script and is absent under reduced motion and without JavaScript, where everything is simply visible.

## Do's and Don'ts

### Do:
- **Do** build every new block as a strip, a break strip, or a set of cells on the board grid, edge to edge, with 3px gaps and 3px Aluminium rails.
- **Do** keep each folder on its colour everywhere: blue References, green Approved Videos, white Editing Style, pink Brand Kit, yellow Raw, orange Exports.
- **Do** set all text on a card colour in Strip Ink, and supporting text on card in Soft Ink.
- **Do** keep red for the action: one red button per view, plus the repository cell and the closing panel.
- **Do** name things in Sofia Sans Extra Condensed capitals at weight 800 and explain them in Sofia Sans at 400, capped in `ch`.
- **Do** show literal file and folder names in their real case, in monospace within text or in Figure type when they are the subject.
- **Do** separate fields with a 1px hairline of Strip Ink at 40% and a 1.5rem inset.
- **Do** bring strips in with deal, drop or rise on the single ease-out curve, once, and leave them visible when motion is reduced.

### Don't:
- **Don't** use gradients, glows, or a product or timeline mock-up; the board is the image.
- **Don't** round a strip, cell, tab or panel. Only the action button has a radius (2px).
- **Don't** put a shadow on anything fixed. Only the action button and the travelling job strip are lifted.
- **Don't** use red for a folder, a heading accent or a status, and don't use a folder colour for decoration.
- **Don't** put white text on a card colour.
- **Don't** wrap content in a centred max-width container or float it as a card with space all round; strips run full width.
- **Don't** set running text in the condensed face, or uppercase a file name.
- **Don't** fade things in; entrances are clipped and travel a short distance.
