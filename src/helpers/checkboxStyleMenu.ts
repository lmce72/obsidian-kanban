import { App, Menu } from 'obsidian';

interface CheckboxStyle {
  symbol: string;
  description: string;
}

interface CheckboxStyleProvider {
  getEnabledStyles: () => unknown;
  settings?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isTaskSymbol(value: unknown): value is string {
  return typeof value === 'string' && value.length === 1 && !['\r', '\n', '[', ']'].includes(value);
}

function getProvider(app: App): CheckboxStyleProvider | null {
  // 可选插件桥接，不依赖其 CodeMirror 私有状态或修改其设置。
  // Optional bridge: do not depend on private CodeMirror state or change provider settings.
  const plugins = (app as App & { plugins?: { getPlugin(id: string): unknown } }).plugins;
  const provider = plugins?.getPlugin('checkbox-style-menu');
  if (!isRecord(provider) || typeof provider.getEnabledStyles !== 'function') return null;
  const getEnabledStyles = provider.getEnabledStyles;
  return { getEnabledStyles: () => getEnabledStyles.call(provider), settings: provider.settings };
}

export function getCheckboxCycleStatus(app: App, current: string): string | undefined {
  const settings = getProvider(app)?.settings;
  if (
    !isRecord(settings) ||
    settings.cycleEnabled !== true ||
    !Array.isArray(settings.cycleStates)
  ) {
    return undefined;
  }
  const states = settings.cycleStates.filter(isTaskSymbol);
  if (states.length < 2) return undefined;
  return states[(states.indexOf(current) + 1) % states.length];
}

export function showCheckboxStyleMenu(
  app: App,
  event: MouseEvent,
  current: string,
  onSelect: (symbol: string) => void
): boolean {
  const provider = getProvider(app);
  if (!provider) return false;
  const values = provider.getEnabledStyles();
  if (!Array.isArray(values)) return false;
  const styles: CheckboxStyle[] = values.filter(
    (value): value is CheckboxStyle =>
      isRecord(value) && isTaskSymbol(value.symbol) && typeof value.description === 'string'
  );
  if (!styles.length) return false;

  event.preventDefault();
  event.stopPropagation();
  // 复用提供者启用的状态，菜单键盘与定位交给 Obsidian。
  // Reuse enabled provider states; Obsidian owns menu keyboard handling and positioning.
  const menu = new Menu();
  styles.forEach(({ symbol, description }) => {
    menu.addItem((item) =>
      item
        .setTitle(`${description} [${symbol}]`)
        .setChecked(symbol === current)
        .onClick(() => onSelect(symbol))
    );
  });
  if (event.clientX === 0 && event.clientY === 0 && event.targetNode.instanceOf(HTMLElement)) {
    const rect = event.targetNode.getBoundingClientRect();
    menu.showAtPosition({ x: rect.left, y: rect.bottom });
  } else {
    menu.showAtMouseEvent(event);
  }
  return true;
}
