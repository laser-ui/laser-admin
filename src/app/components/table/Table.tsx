import type { AppTableColumn, AppTableProps } from './types';

import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useStorage } from '@laser-ui/admin';
import { RouterContext } from '@laser-ui/admin/packages/router/context';
import { Button, Dropdown, Icon, Popover, Separator } from '@laser-ui/components';
import { useAsync } from '@laser-ui/hooks';
import { isSimpleArrayEqual } from '@laser-ui/utils';
import RefreshOutlined from '@material-design-icons/svg/outlined/refresh.svg?react';
import SettingsOutlined from '@material-design-icons/svg/outlined/settings.svg?react';
import ViewDayOutlined from '@material-design-icons/svg/outlined/view_day.svg?react';
import ViewModuleOutlined from '@material-design-icons/svg/outlined/view_module.svg?react';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { ColConfigItem } from './ColConfigItem';
import { Mobile } from './Mobile';
import { PC } from './PC';
import { SortableColConfigItem } from './SortableColConfigItem';

export function AppTable<T = any>(props: AppTableProps<T>): JSX.Element | null {
  const {
    id: _id,
    name: _name,
    tools = ['refresh', 'grid', 'layout', 'settings'],
    columns,
    grid: _grid,
    layout: _layout,
    onRefresh,
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
  const [activeCol, setActiveCol] = useState<string | null>(null);
  const colSorts = (() => {
    const prev: string[] = storage.value.sorts ?? [];
    if (isSimpleArrayEqual(prev, defaultColSorts)) {
      return prev;
    }
    return defaultColSorts;
  })();
  const colHiddens = new Set<string>(storage.value.hiddens ?? defaultHiddens);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const columnsWithConfig = colSorts.map((key) => ({ ...columnMap.get(key)!, hidden: colHiddens.has(key) }));
  const handleHiddenChange = (id: string, hidden: boolean) => {
    const hiddens = new Set(colHiddens);
    if (hidden) {
      hiddens.add(id);
    } else {
      hiddens.delete(id);
    }
    storage.set({ ...storage.value, hiddens: Array.from(hiddens) });
  };

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
                    <div style={{ padding: '8px 8px 8px 0' }}>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={(event) => {
                          const { active } = event;

                          setActiveCol(active.id as string);
                        }}
                        onDragEnd={(event) => {
                          dragEnd.current?.();
                          dragEnd.current = async.setTimeout(() => {
                            dragEnd.current = undefined;
                          }, 50);

                          const { active, over } = event;

                          if (active.id !== over!.id) {
                            const oldIndex = colSorts.indexOf(active.id as string);
                            const newIndex = colSorts.indexOf(over!.id as string);
                            storage.set({ ...storage.value, sorts: arrayMove(colSorts, oldIndex, newIndex) });
                          }

                          setActiveCol(null);
                        }}
                      >
                        <SortableContext items={colSorts} strategy={verticalListSortingStrategy}>
                          {colSorts.map((id) => (
                            <SortableColConfigItem
                              key={id}
                              id={id}
                              text={columnMap.get(id)!.th}
                              hidden={colHiddens.has(id)}
                              disabled={defaultHiddens.has(id)}
                              onHiddenChange={(hidden) => {
                                handleHiddenChange(id, hidden);
                              }}
                            />
                          ))}
                        </SortableContext>
                        <DragOverlay>
                          {activeCol ? (
                            <ColConfigItem
                              hidden={colHiddens.has(activeCol)}
                              disabled={defaultHiddens.has(activeCol)}
                              onHiddenChange={(hidden) => {
                                handleHiddenChange(activeCol, hidden);
                              }}
                            >
                              {columnMap.get(activeCol)!.th}
                            </ColConfigItem>
                          ) : null}
                        </DragOverlay>
                      </DndContext>
                    </div>
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
      <PC {...props} columns={columnsWithConfig} grid={grid} layout={layout} />
      <Mobile {...props} columns={columnsWithConfig} grid={grid} layout={layout} />
    </>
  );
}
