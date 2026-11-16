import { App, TFile, getFrontMatterInfo, parseYaml } from 'obsidian';
import { getDailyNoteSettings, getDateFromFile } from 'obsidian-daily-notes-interface';

import type { KanbanFormat } from './Settings';
import { frontmatterKey } from './parsers/common';

export function getKanbanFormat(value: unknown): KanbanFormat | undefined {
  // Properties 列表字段可以将单个值保存成数组。
  // A Properties list field can store its single value as an array.
  const format = Array.isArray(value) && value.length === 1 ? value[0] : value;
  if (format === 'basic') return 'board';
  if (format === 'board' || format === 'table' || format === 'list') return format;
  return undefined;
}

export function gotoNextDailyNote(app: App, file: TFile) {
  const date = getDateFromFile(file as any, 'day');

  if (!date || !date.isValid()) {
    return;
  }

  const dailyNotePlugin = (app as any).internalPlugins.plugins['daily-notes'].instance;

  dailyNotePlugin.gotoNextExisting(date);
}

export function gotoPrevDailyNote(app: App, file: TFile) {
  const date = getDateFromFile(file as any, 'day');

  if (!date || !date.isValid()) {
    return;
  }

  const dailyNotePlugin = (app as any).internalPlugins.plugins['daily-notes'].instance;

  dailyNotePlugin.gotoPreviousExisting(date);
}

export function buildLinkToDailyNote(app: App, dateStr: string) {
  const dailyNoteSettings = getDailyNoteSettings();
  const shouldUseMarkdownLinks = !!(app.vault as any).getConfig('useMarkdownLinks');

  if (shouldUseMarkdownLinks) {
    return `[${dateStr}](${
      dailyNoteSettings.folder ? `${encodeURIComponent(dailyNoteSettings.folder)}/` : ''
    }${encodeURIComponent(dateStr)}.md)`;
  }

  return `[[${dateStr}]]`;
}

export function readFrontmatter(data: string): Record<string, unknown> | undefined {
  if (!data) return undefined;
  const info = getFrontMatterInfo(data);
  if (!info.exists) return undefined;
  try {
    // 解析真正的 YAML 属性，避免把正文或相似属性名当成看板标记。
    // Parse the actual YAML property, excluding body text and similar property names.
    const frontmatter: unknown = parseYaml(info.frontmatter);
    if (typeof frontmatter !== 'object' || frontmatter === null || Array.isArray(frontmatter)) {
      return undefined;
    }
    return frontmatter as Record<string, unknown>;
  } catch {
    // 无效 YAML 不提供切换入口，保留在编辑器中供用户修正。
    // Invalid YAML leaves the note in the editor so the user can correct it.
    return undefined;
  }
}

export function hasFrontmatterKeyRaw(data: string) {
  return getKanbanFormat(readFrontmatter(data)?.[frontmatterKey]) !== undefined;
}

export function hasFrontmatterKey(file: TFile) {
  if (!file) return false;
  const cache = app.metadataCache.getFileCache(file);
  return getKanbanFormat(cache?.frontmatter?.[frontmatterKey]) !== undefined;
}

export function laneTitleWithMaxItems(title: string, maxItems?: number) {
  if (!maxItems) return title;
  return `${title} (${maxItems})`;
}
