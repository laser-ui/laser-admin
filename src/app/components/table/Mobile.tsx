import type { AppTableColumn, AppTableProps } from './types';

import { Button, Card, Checkbox, Dropdown, Empty, Icon, Spinner } from '@laser-ui/components';
import { useImmer } from '@laser-ui/hooks';
import { classNames } from '@laser-ui/utils';
import ArrowDropDownOutlined from '@material-design-icons/svg/outlined/arrow_drop_down.svg?react';
import ArrowDropUpOutlined from '@material-design-icons/svg/outlined/arrow_drop_up.svg?react';
import MoreHorizOutlined from '@material-design-icons/svg/outlined/more_horiz.svg?react';
import { Link, useNavigate } from 'react-router';

import { getContent, getKey } from './utils';
import { AppDetailView } from '../detail-view';

export function Mobile<T = any>(
  props: AppTableProps<T> & { grid: boolean; layout: 'default' | 'middle' | 'compact' },
): React.ReactElement | null {
  const { className, list, columns, selectable, actionOpts, expand: _expand, itemKey = getKey, layout } = props;

  const navigate = useNavigate();

  const [expands, setExpands] = useImmer(new Set<any>());

  const { titleCol, detailView } = (() => {
    let titleCol: AppTableColumn<T> | undefined;
    const detailViews: ((data: T, index: number) => { label: string; content: React.ReactNode })[] = [];
    const detailView = (data: T, index: number) =>
      detailViews.reduce(
        (previous, current) => previous.concat([current(data, index)]),
        [] as { label: string; content: React.ReactNode }[],
      );
    columns.forEach((column) => {
      if (!column.hidden) {
        if (column.asTitle) {
          titleCol = column;
        } else {
          detailViews.push((data, dataIndex) => ({
            label: column.th,
            content: getContent(column, data, dataIndex),
          }));
        }
      }
    });
    return { titleCol, detailView };
  })();

  const size = layout === 'default' ? undefined : layout === 'middle' ? 12 : 8;

  return (
    <div className={className}>
      {list.length === 0 ? (
        <Empty />
      ) : (
        list.map((data, index) => {
          const id = itemKey(data, index);
          const isExpand = expands.has(id);
          const list = detailView(data, index);

          return (
            <Card key={id} className="mb-3">
              {(titleCol || selectable) && (
                <Card.Header
                  styleOverrides={{
                    card__header: { style: { padding: size, borderBottom: list.length === 0 ? 'none' : undefined } },
                    'card__header-title': { className: 'app-table__card-header' },
                  }}
                  action={
                    actionOpts
                      ? (() => {
                          const actions = actionOpts.actions(data, index).filter((action) => !action.hidden);
                          if (actions.length === 0) {
                            return undefined;
                          }

                          return actions.length === 1 && actions[0].link ? (
                            (() => {
                              const action = actions[0];
                              const node = action.link ? (
                                <Link className="app-link" to={action.link}>
                                  <Icon>
                                    <MoreHorizOutlined />
                                  </Icon>
                                </Link>
                              ) : (
                                <Button
                                  pattern="link"
                                  icon={
                                    <Icon>
                                      <MoreHorizOutlined />
                                    </Icon>
                                  }
                                  onClick={action.onclick}
                                />
                              );
                              return action.render ? action.render(node) : node;
                            })()
                          ) : (
                            <Dropdown
                              list={actions.map((action, indexOfAction) => ({
                                id: indexOfAction,
                                title: action.text,
                                type: 'item',
                              }))}
                              placement="bottom-right"
                              onClick={(id: number) => {
                                if (actions[id].link) {
                                  navigate(actions[id].link!);
                                } else {
                                  return actions[id].onclick?.();
                                }
                              }}
                            >
                              {(dropdownProps) => (
                                <Button
                                  {...dropdownProps}
                                  pattern="link"
                                  icon={
                                    <Icon>
                                      <MoreHorizOutlined />
                                    </Icon>
                                  }
                                />
                              )}
                            </Dropdown>
                          );
                        })()
                      : undefined
                  }
                >
                  {(() => {
                    const selectNode = selectable && selectable.item(data, index);

                    return selectNode && <Checkbox model={selectNode.checked} onModelChange={selectNode.onChange} />;
                  })()}
                  {titleCol && getContent(titleCol, data, index)}
                </Card.Header>
              )}
              {(() => {
                if (list.length > 0) {
                  return (
                    <Card.Content styleOverrides={{ card__content: { style: { padding: size } } }}>
                      <AppDetailView list={list} col={12} gutter={layout === 'default' ? 3 : layout === 'middle' ? 2 : 1} vertical />
                    </Card.Content>
                  );
                }
                return null;
              })()}
              {(() => {
                if (actionOpts && !titleCol && !selectable) {
                  const actions = actionOpts.actions(data, index).filter((action) => !action.hidden);
                  if (actions.length === 0) {
                    return;
                  }

                  const getAction = (action: (typeof actions)[0]) => {
                    const node = action.link ? (
                      <Card.Action
                        title="edit"
                        onClick={() => {
                          navigate(action.link!);
                        }}
                      >
                        {action.text}
                      </Card.Action>
                    ) : (
                      <Card.Action disabled={action.loading} onClick={action.onclick}>
                        {action.loading ? <Spinner visible size="1em" alone /> : action.text}
                      </Card.Action>
                    );
                    return action.render ? action.render(node) : node;
                  };

                  return (
                    <Card.Actions
                      actions={
                        actions.length > 2
                          ? [
                              getAction(actions[0]),
                              <Dropdown
                                list={actions.slice(1).map((action, indexOfAction) => ({
                                  id: indexOfAction + 1,
                                  title: action.text,
                                  type: 'item',
                                }))}
                                placement="bottom-right"
                                onClick={(id: number) => {
                                  if (actions[id].link) {
                                    navigate(actions[id].link!);
                                  } else {
                                    return actions[id].onclick?.();
                                  }
                                }}
                              >
                                {(dropdownProps) => (
                                  <Card.Action {...dropdownProps}>
                                    <Icon>
                                      <MoreHorizOutlined />
                                    </Icon>
                                  </Card.Action>
                                )}
                              </Dropdown>,
                            ]
                          : actions.map((action) => getAction(action))
                      }
                    />
                  );
                }
              })()}
              {_expand && (
                <div className="app-table__expand">
                  <div style={{ display: isExpand ? undefined : 'none', padding: 16 }}>{_expand(data, index, isExpand)}</div>
                  <div
                    className={classNames('app-table__expand-button', {
                      'is-expand': isExpand,
                    })}
                    onClick={() => {
                      setExpands((draft) => {
                        if (draft.has(id)) {
                          draft.delete(id);
                        } else {
                          draft.add(id);
                        }
                      });
                    }}
                  >
                    <Button pattern="link" icon={<Icon>{isExpand ? <ArrowDropUpOutlined /> : <ArrowDropDownOutlined />}</Icon>} />
                  </div>
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
