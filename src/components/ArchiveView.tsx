import { t } from '../lang/helpers';
import { MarkdownRenderer } from './MarkdownRenderer/MarkdownRenderer';
import { c } from './helpers';
import { Item } from './types';

export function ArchiveView({ items, query }: { items: Item[]; query: string }) {
  const matches = [...items].reverse().filter((item) => {
    return !query || item.data.titleRaw.toLocaleLowerCase().includes(query);
  });

  // 归档使用已有 Markdown 预览，不创建任务写入或拖拽路径。
  // Reuse Markdown previews without creating task-edit or drag paths for archived cards.
  return (
    <section className={c('archive-view')} tabIndex={0} aria-label={t('Archived cards')}>
      <header className={c('archive-header')}>
        <h2>{t('Archived cards')}</h2>
        <span role="status">
          {matches.length} / {items.length}
        </span>
      </header>
      {matches.length ? (
        <ol className={c('archive-list')}>
          {matches.map((item) => (
            <li key={item.id} className={c('archive-card')}>
              <MarkdownRenderer
                entityId={`archive:${item.id}`}
                markdownString={item.data.titleRaw}
              />
            </li>
          ))}
        </ol>
      ) : (
        <p className={c('empty-state')}>
          {t(items.length ? 'No matching cards' : 'No archived cards')}
        </p>
      )}
    </section>
  );
}
