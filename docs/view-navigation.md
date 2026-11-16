# View navigation and layout — 2.0.53

## Behavior

- An open Markdown note with a supported `kanban-plugin` property offers **Open as kanban board** in its menu and in the command palette. The existing toggle command also works. Supported formats are `board`, `table`, `list`, legacy `basic`, and their single-item list forms. Similar property names, body mentions, and malformed YAML do not qualify.
- Eligibility reads current editor content rather than waiting for the metadata cache. Switching saves pending edits first. Detection and actual board loading use the same Obsidian YAML extraction helper. Reading a list-form property does not silently rewrite it as a scalar.
- View switching synchronizes the board's in-memory format with its frontmatter so a later card save cannot restore the previous format.
- **View archive (N)** appears alongside board/table/list in the view selector. A command is also available. The archive is a read-only Markdown preview, newest cards first, using the existing archive data and file format. Opening or filtering it does not modify the file. Search works within the archive and shows a match count. The selected regular view is retained when entering the archive.
- Search uses available pane width with a separate accessible close button. Escape clears and closes it. No-match feedback is available in board, table, list, and archive views.
- List lanes use the full pane width by default. Explicit board/plugin overrides remain supported, and the settings toggle/reset agree with that default.
- Table view fills available space, retains sticky headers and column resizing, and exposes a named, keyboard-scrollable region. Sort headers are native buttons with `aria-sort`. Rows use stable card IDs to retain their identity during sorting and filtering.
- Card previews, new-card editors, archived cards, and drag previews share `--kanban-card-radius`, derived from the theme's small radius and capped at 6px. They no longer inherit `--input-radius`, which can be pill-shaped on mobile. Checkbox radius and external checkbox styling rules are unchanged.

## Validation checklist

Use a disposable vault with synthetic notes and synchronization disabled.

1. Open a normal board as Markdown; verify the menu and command can return to Kanban. Repeat with a single-item YAML list property.
2. In an ordinary note with no cached Kanban property, edit the live contents to add `kanban-plugin: board`. Verify immediate eligibility, switch, and confirm the unsaved content reached disk.
3. Confirm plain text mentioning the property does not enable the command. Invalid YAML and other property names do not qualify.
4. Switch between table and list, edit a checkbox, wait for the save debounce, and verify that frontmatter, footer settings, and the board snapshot retain the chosen format.
5. Focus a table header and press Enter. Verify sorting, `aria-sort`, retained button identity/focus, and keyboard access to the scroll region.
6. Archive a completed card. Verify it leaves the active list, the archive count increases, its nested content appears in archive view, and the file's existing archive section persists it. Clicking an archived checkbox must not alter archive data.
7. Search and clear search across views; verify matching, empty-state text, full-width input, and Escape dismissal.
8. Use real desktop split panes to check narrow available widths. Inspect light and dark CSS appearances. Desktop viewport simulation is not evidence of mobile compatibility.
9. Override `--input-radius` to 40px and the theme's small radius to 30px in the test pane. Confirm the card computes to 6px while native checkbox radius is unchanged; restore the test overrides afterward.

## Recorded environment and limits

Windows, Obsidian 1.15.1, isolated test vault, synthetic notes. Production notes and installed plugin files were not changed. Typecheck, build, and full source lint are separate validation steps.

Recorded outcomes: the native Markdown pane menu offered the switch command; single-item list properties opened as board mode; a live property was eligible before the cache contained it; negative examples remained Markdown. Keyboard Enter sorted the table while preserving the focused header button. Archiving moved the completed fixture from the active cards into the existing archive section and increased its count from 2 to 3; filtering reduced the visible archive count to 1 of 3. Split panes measured approximately 513px with a 444px search input. A later checkbox save retained `list` in frontmatter, footer settings, and the board snapshot. Under oversized radius variables, the card computed to 6px and the checkbox remained 4px.

The archive viewer intentionally does not restore or edit archived cards. Existing archive retention settings still apply. Physical mobile devices, touch gestures, and mobile long-press behavior were not tested; the mobile corner fix was checked through the relevant CSS variable conditions rather than claimed as a device test. Checkbox Style Menu integration continues to use the optional adapter introduced in 2.0.52.
