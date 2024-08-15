import type { AppTableColumn, AppTableProps } from './types';

import { RouterContext } from '@laser-pro/router/context';
import { useStorage } from '@laser-pro/storage';
import { Button, Checkbox, Dropdown, Icon, Popover, Separator } from '@laser-ui/components';
import { useAsync } from '@laser-ui/hooks';
import { isSimpleArrayEqual } from '@laser-ui/utils';
import RefreshOutlined from '@material-design-icons/svg/outlined/refresh.svg?react';
import SettingsOutlined from '@material-design-icons/svg/outlined/settings.svg?react';
import ViewDayOutlined from '@material-design-icons/svg/outlined/view_day.svg?react';
import ViewModuleOutlined from '@material-design-icons/svg/outlined/view_module.svg?react';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Mobile } from './Mobile';
import { PC } from './PC';
import { SortableCols } from './sortable-cols';

export function AppTable<T = any>(props: AppTableProps<T>): JSX.Element | null {
  const {
    id: _id,
    name: _name,
    tools = ['refresh', 'grid', 'layout', 'settings'],
    columns,
    grid: _grid,
    layout: _layout,
    onRefresh,
    render,
  } = props;

  const { t } = useTranslation();
  const location = useLocation();
  const { title } = useContext(RouterContext);
  const async = useAsync();

  const dragEnd = useRef<() => void>();

  const name = _name ?? title;
  const id = _id ?? location.pathname + (name ? name : '');

  const storage = useStorage<{
    grid?: boolean;
    layout?: 'default' | 'middle' | 'compact';
    sorts?: string[];
    hiddens?: string[];
  }>(`a_table_${id}`, { defaultValue: {}, parser: 'json' });

  const grid = _grid ?? storage.value.grid ?? false;
  const layout = _layout ?? storage.value.layout ?? 'default';

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [columnMap, defaultColSorts, defaultHiddens] = (() => {
    const columnMap = new Map<string, AppTableColumn<T>>();
    const sorts: string[] = [];
    const hiddens = new Set<string>();
    columns.forEach((column) => {
      const key = column.key ?? column.th;
      columnMap.set(key, column);
      sorts.push(key);
      if (column.hidden) {
        hiddens.add(key);
      }
    });
    return [columnMap, sorts, hiddens];
  })();
  const colSorts = (() => {
    const prev: string[] = storage.value.sorts ?? [];
    if (isSimpleArrayEqual(prev, defaultColSorts)) {
      return prev;
    }
    return defaultColSorts;
  })();
  const colHiddens = new Set<string>(storage.value.hiddens ?? defaultHiddens);

  const columnsWithConfig = colSorts.map((key) => ({ ...columnMap.get(key)!, hidden: colHiddens.has(key) }));

  const table = (
    <>
      <PC {...props} columns={columnsWithConfig} grid={grid} layout={layout} />
      <Mobile {...props} columns={columnsWithConfig} grid={grid} layout={layout} />
    </>
  );

  return (
    <>
      {(name || tools.length > 0) && (
        <div className="app-table__header">
          {name && <div className="app-table__title">{name}</div>}
          <div className="app-table__actions">
            {tools.includes('refresh') && (
              <Icon title={t('components.table.Refresh')} onClick={onRefresh}>
                <RefreshOutlined />
              </Icon>
            )}
            {tools.includes('grid') && (
              <Icon
                title={t('components.table.Grid')}
                theme={grid ? 'primary' : undefined}
                onClick={() => {
                  storage.set({ ...storage.value, grid: !grid });
                }}
              >
                <ViewModuleOutlined />
              </Icon>
            )}
            {tools.includes('layout') && (
              <Dropdown
                list={[
                  { id: 'default', title: t('components.table.Default') },
                  { id: 'middle', title: t('components.table.Middle') },
                  { id: 'compact', title: t('components.table.Compact') },
                ].map(({ id, title }) => ({
                  id,
                  title: <div className={layout === id ? 'app-theme-primary' : undefined}>{title}</div>,
                  type: 'item',
                }))}
                trigger="click"
                onClick={(id) => {
                  storage.set({ ...storage.value, layout: id as any });
                }}
              >
                <Icon title={t('components.table.Layout')}>
                  <ViewDayOutlined />
                </Icon>
              </Dropdown>
            )}
            {tools.includes('settings') && (
              <Popover
                styleOverrides={{ popover__body: { style: { minWidth: 200, padding: 0 } } }}
                visible={settingsVisible}
                content={
                  <>
                    <SortableCols
                      items={colSorts}
                      onChange={(items) => {
                        storage.set({ ...storage.value, sorts: items });
                      }}
                      renderItem={(item) => (
                        <SortableCols.Item id={item}>
                          <SortableCols.DragHandle />
                          <Checkbox
                            model={!colHiddens.has(item)}
                            disabled={defaultHiddens.has(item)}
                            onModelChange={(checked) => {
                              const hiddens = new Set(colHiddens);
                              if (checked) {
                                hiddens.delete(item);
                              } else {
                                hiddens.add(item);
                              }
                              storage.set({ ...storage.value, hiddens: Array.from(hiddens) });
                            }}
                          >
                            {columnMap.get(item)!.th}
                          </Checkbox>
                        </SortableCols.Item>
                      )}
                      onDragEnd={() => {
                        dragEnd.current?.();
                        dragEnd.current = async.setTimeout(() => {
                          dragEnd.current = undefined;
                        }, 50);
                      }}
                    />
                    <div className="app-table__col-config-actions">
                      <Button
                        style={{ flexGrow: 1 }}
                        pattern="link"
                        onClick={() => {
                          storage.set({ ...storage.value, sorts: defaultColSorts, hiddens: Array.from(defaultHiddens) });
                        }}
                      >
                        {t('Reset')}
                      </Button>
                      <Separator style={{ margin: 0 }} vertical />
                      <Button
                        style={{ flexGrow: 1 }}
                        pattern="link"
                        onClick={() => {
                          setSettingsVisible(false);
                        }}
                      >
                        {t('OK')}
                      </Button>
                    </div>
                  </>
                }
                trigger="click"
                placement="bottom-right"
                arrow={false}
                onVisibleChange={(visible) => {
                  if (visible || !dragEnd.current) {
                    setSettingsVisible(visible);
                  }
                }}
              >
                <Icon title={t('components.table.Settings')}>
                  <SettingsOutlined />
                </Icon>
              </Popover>
            )}
          </div>
        </div>
      )}
      {render ? render(table) : table}
    </>
  );
}
