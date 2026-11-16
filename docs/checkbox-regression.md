# Checkbox compatibility regression

## Changes in 2.0.52

- Index task list items rather than individual controls. A hidden original and a visible replacement share an index.
- Handle nested task activation on click during capture, covering keyboard activation and preventing a foreign replacement handler from writing a second time. Embedded notes retain their own interactions.
- Read enabled states and optional click cycles from Checkbox Style Menu using a validated optional adapter. Use Obsidian's Menu to select a marker on a card or nested task, without accessing private CodeMirror state or modifying provider settings.
- Keep native inputs and `data-task` markers so Multistate Checkboxes can style them.
- Reconcile views after the initial subscription. Keep registration when Obsidian reopens the same file without calling `setViewData`.
- Give ESLint a project containing every linted source file while preserving the production build's existing TypeScript entry points. Keep TypeScript checkouts in LF format on Windows, matching the lint rule.

## Isolated reproduction

Use a fresh disposable vault with synchronization disabled. Install Kanban, Task Genius (`obsidian-task-progress-bar`), Tasks, Dataview, Checkbox Style Menu, and Multistate Checkboxes. Enable Task Genius's reading-mode task status switcher with custom task marks disabled. Enable the desired states in Checkbox Style Menu.

Create a board with a parent card and three indented tasks:

````markdown
---
kanban-plugin: board
---

## Todo

- [ ] Parent
    - [ ] First child [id:: synthetic1]
    - [x] Second child [id:: synthetic2]
    - [ ] Third child

%% kanban:settings
```
{"kanban-plugin":"board","show-checkboxes":true}
```
%%
````

Before the fix, Task Genius supplies a hidden original and a visible replacement for each child. Kanban assigns indexes `0,1,2,3,4,5`, so clicking the first visible child targets the second source task. After the fix the indexes are `0,0,1,1,2,2`.

## Acceptance checklist

1. Open the board, then open the same file again. It remains rendered.
2. Click the first visible child. Only its source task changes. Preserve its inline ID and its siblings' states. Wait for the normal save debounce before inspecting the file.
3. Focus the second visible checkbox and press Space. Only the second source task changes.
4. Right-click the third child and select `Question [?]`. Verify `[?]` in the file, `data-task="?"` on its list item, and the question image/color supplied by Multistate Checkboxes.
5. Right-click the parent and select `Incomplete [/]`. Verify its file marker and input's `data-task` are `/`.
6. Reload Kanban and reopen the file. All markers persist and the board remains visible.
7. Disable Checkbox Style Menu; normal toggles still work. Disable Task Genius's replacements and repeat with ordinary checkboxes.
8. Enable Checkbox Style Menu's click cycle and verify that parent and child follow its configured symbols. Restore the test setting afterward.

## Recorded validation

Verified in a disposable Windows vault on Obsidian 1.15.1, with Task Genius 9.13.1, Tasks 8.6.0, Dataview 0.5.68, Checkbox Style Menu 1.3.0, and Multistate Checkboxes 1.0.9. Tests used synthetic notes. The production vault was inspected without modification.

Build, production typecheck, and full source lint are separate checks. This focused fix does not certify every legacy feature or third-party combination. Physical mobile devices and touch long-press menus have not been verified. Task Genius's custom span-based marks are outside the native-checkbox replacement case. The guarded optional style-menu API may need adjustment if the provider changes it.
