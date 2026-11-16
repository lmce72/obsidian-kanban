# Obsidian Kanban Plugin

## Maintained fork: 2.0.52

This fork preserves the original plugin ID (`obsidian-kanban`) and credits mgmeyers and the upstream contributors. It fixes nested checkbox targeting when another Markdown processor, such as Task Genius, inserts replacement controls, and fixes blank boards during fast loading or reopening the current file.

When **Checkbox Style Menu** is enabled, right-click a card checkbox or a nested task checkbox to choose from that plugin's enabled states. Kanban presents those choices through Obsidian's native menu and saves through its own board state; the editor plugin's private CodeMirror menu is not invoked. Its configured click cycle is also respected when enabled. **Multistate Checkboxes** continues to supply the visuals through the original `data-task` attributes. Both integrations are optional. Selecting a state changes its checkbox marker, matching the style menu's behavior; ordinary completion toggles still use the Tasks API when available.

To build, run `yarn install --frozen-lockfile`, `yarn typecheck`, and `yarn build`. To install manually, disable Kanban, back up its plugin directory, and copy `main.js`, `manifest.json`, and `styles.css` into the existing `<vault-config>/plugins/obsidian-kanban/` directory, retaining `data.json`. Enable Kanban again. See [the regression checklist](docs/checkbox-regression.md) for validation and limitations.

**The Kanban plugin is looking for new maintainers.** Interested? [Read more here.](https://github.com/mgmeyers/obsidian-kanban/blob/main/MAINTAINERS.md)

---

Create markdown-backed Kanban boards in [Obsidian](https://obsidian.md/)

- [Bugs, Issues, & Feature Requests](https://github.com/mgmeyers/obsidian-kanban/issues)
- [Development Roadmap](https://github.com/mgmeyers/obsidian-kanban/projects/1)

![Screen Shot 2021-09-16 at 12.58.22 PM.png](https://github.com/mgmeyers/obsidian-kanban/blob/main/docs/Assets/Screen%20Shot%202021-09-16%20at%2012.58.22%20PM.png)

![Screen Shot 2021-09-16 at 1.10.38 PM.png](https://github.com/mgmeyers/obsidian-kanban/blob/main/docs/Assets/Screen%20Shot%202021-09-16%20at%201.10.38%20PM.png)

## Documentation

Find the plugin documentation here: [Obsidian Kanban Plugin Documentation](https://publish.obsidian.md/kanban/)
