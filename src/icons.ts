import { addIcon } from 'obsidian';

export const kanbanIcon = 'obsidian-kanban-board';
export const archiveViewIcon = 'obsidian-kanban-archive-view';

export function registerKanbanIcons() {
  // 使用自有、带命名空间的图标，避免内置图标改名后变空白。
  // Namespaced local icons remain available when bundled icon names change.
  addIcon(
    kanbanIcon,
    '<g fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="10" width="80" height="80" rx="8"/><path d="M35 30v40M65 30v24"/></g>'
  );
  addIcon(
    archiveViewIcon,
    '<g fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="12" width="80" height="20" rx="4"/><path d="M18 34v52h64V34M40 48h20M34 66h32"/></g>'
  );
}
