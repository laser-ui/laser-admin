import type { AppTableColumn, AppTableProps } from './types';

import { Button, Card, Dropdown, Empty, Icon, Separator, Spinner, Table } from '@laser-ui/components';
import { useImmer } from '@laser-ui/hooks';
import { classNames } from '@laser-ui/utils';
import ArrowDropDownOutlined from '@material-design-icons/svg/outlined/arrow_drop_down.svg?react';
import ArrowDropUpOutlined from '@material-design-icons/svg/outlined/arrow_drop_up.svg?react';
import MoreHorizOutlined from '@material-design-icons/svg/outlined/more_horiz.svg?react';
import { get, isNumber, isString, isUndefined } from 'lodash';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { AppDetailView } from '../detail-view';

function toCss(val: string | number) {
  return isNumber(val) ? val + 'px' : val;
}
function getFixed(fixed: AppTableColumn<any>['fixed'], actionOpts: AppTableProps<any>['actionOpts']) {
  if (fixed) {
    if (!isUndefined(fixed.right) && actionOpts) {
      return Object.assign({}, fixed, { right: `calc(${toCss(fixed.right)} + ${toCss(actionOpts.width)})` });
    }
    return fixed;
  }
}

export function AppTable<T = any>(props: AppTableProps<T>): JSX.Element | null {
  const {
    className,
    name,
    list,
    columns: _columns,
    actionOpts,
    expand: _expand,
    expandFixed,
    scroll,
    itemKey = (data) => (data as any)['id'],
  } = props;

  const columns = _columns.filter((column) => !column.hidden);
  const titleIndex = columns.findIndex((column) => column.title);

  const { t } = useTranslation();

  const navigate = useNavigate();

  const [expands, setExpands] = useImmer(new Set<any>());

  return (
    <>
      <Table
        className={classNames('d-none d-md-block', className)}
        style={{
          maxHeight: scroll?.y,
          overflowX: isUndefined(scroll?.x) ? 'hidden' : 'auto',
          overflowY: isUndefined(scroll?.y) ? 'hidden' : 'auto',
        }}
      >
        <table style={{ minWidth: scroll?.x }}>
          {name && <caption>{name}</caption>}
          <thead>
            <tr>
              {!isUndefined(_expand) && <Table.Th width={60} fixed={Object.assign({ top: 0 }, expandFixed)} />}
              {columns.map((column, index) => (
                <Table.Th
                  key={index}
                  width={column.width}
                  sort={column.thProps?.sort}
                  action={column.thProps?.action}
                  fixed={Object.assign({ top: 0 }, getFixed(column.fixed, actionOpts))}
                  align={column.align}
                >
                  {column.th}
                </Table.Th>
              ))}
              {actionOpts && (
                <Table.Th width={actionOpts.width} fixed={{ top: 0, right: 0 }}>
                  {t('components.table.ACTIONS')}
                </Table.Th>
              )}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <Table.Empty />
            ) : (
              list.map((data, index) => {
                const id = itemKey(data, index);
                const expandNode = !isUndefined(_expand) && expands.has(id) ? _expand(data, index) : false;

                return (
                  <Fragment key={id}>
                    <tr>
                      {!isUndefined(_expand) && (
                        <Table.Td width={60} align="center">
                          <Table.Expand
                            expand={expands.has(id)}
                            onExpandChange={(expand) => {
                              setExpands((draft) => {
                                if (expand) {
                                  draft.add(id);
                                } else {
                                  draft.delete(id);
                                }
                              });
                            }}
                          />
                        </Table.Td>
                      )}
                      {columns.map((column, indexOfCol) => {
                        const content = isString(column.td) ? get(data, column.td) : column.td(data, index);
                        return (
                          <Table.Td key={indexOfCol} width={column.width} fixed={getFixed(column.fixed, actionOpts)} align={column.align}>
                            {column.nowrap ? <div className="d-flex">{content}</div> : content}
                          </Table.Td>
                        );
                      })}
                      {actionOpts && (
                        <Table.Td width={actionOpts.width} fixed={{ top: 0, right: 0 }}>
                          <div className="d-flex">
                            {(() => {
                              const actions = actionOpts.actions(data, index).filter((action) => !action.hidden);
                              const getAction = (action: (typeof actions)[0]) => {
                                const node = action.link ? (
                                  <Link className="app-link" to={action.link}>
                                    {action.text}
                                  </Link>
                                ) : (
                                  <Button disabled={action.loading} pattern="link" onClick={action.onclick}>
                                    {action.loading ? <Spinner visible size="1em" alone /> : action.text}
                                  </Button>
                                );
                                return action.render ? action.render(node) : node;
                              };
                              if (actions.length > 2) {
                                return (
                                  <>
                                    {getAction(actions[0])}
                                    <Separator vertical />
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
                                      <Button pattern="link">{t('components.table.More')}</Button>
                                    </Dropdown>
                                  </>
                                );
                              } else {
                                return actions.map((action, indexOfAction) => (
                                  <Fragment key={indexOfAction}>
                                    {getAction(action)}
                                    {indexOfAction !== actions.length - 1 && <Separator vertical />}
                                  </Fragment>
                                ));
                              }
                            })()}
                          </div>
                        </Table.Td>
                      )}
                    </tr>
                    {expandNode !== false && (
                      <tr>
                        <td colSpan={1 + columns.length + (actionOpts ? 1 : 0)}>{expandNode}</td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </Table>
      <div className={classNames('d-md-none', className)}>
        {name && <h2 className="app-table__title">{name}</h2>}
        {list.length === 0 ? (
          <Empty />
        ) : (
          list.map((data, index) => {
            const id = itemKey(data, index);
            const expandNode = !isUndefined(_expand) ? _expand(data, index) : false;

            return (
              <Card key={id} className="mb-3">
                {(titleIndex !== -1 || columns[0].checkbox) && (
                  <Card.Header
                    styleOverrides={{ 'card__header-title': { className: 'app-table__card-header' } }}
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
                                <Button
                                  pattern="link"
                                  icon={
                                    <Icon>
                                      <MoreHorizOutlined />
                                    </Icon>
                                  }
                                />
                              </Dropdown>
                            );
                          })()
                        : undefined
                    }
                  >
                    {(() => {
                      const checkbox: any = columns[0].checkbox ? columns[0].td : false;
                      const content = titleIndex !== -1 && columns[titleIndex].td;

                      return (
                        <>
                          {checkbox && checkbox(data, index)}
                          {content && <span>{isString(content) ? get(data, content) : content(data, index)}</span>}
                        </>
                      );
                    })()}
                  </Card.Header>
                )}
                <Card.Content>
                  <AppDetailView
                    list={columns
                      .filter((column, indexOfCol) => !column.checkbox && indexOfCol !== titleIndex)
                      .map((column) => ({
                        label: column.th as string,
                        content: isString(column.td) ? get(data, column.td) : column.td(data, index),
                      }))}
                    col={12}
                    gutter={3}
                    vertical
                  />
                </Card.Content>
                {(() => {
                  if (actionOpts && titleIndex === -1 && !columns[0].checkbox) {
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
                                  <Card.Action>
                                    <Icon>
                                      <MoreHorizOutlined />
                                    </Icon>
                                  </Card.Action>
                                </Dropdown>,
                              ]
                            : actions.map((action) => getAction(action))
                        }
                      />
                    );
                  }
                })()}
                {expandNode !== false && (
                  <div className="app-table__expand">
                    {expands.has(id) && <div style={{ padding: 16 }}>{expandNode}</div>}
                    <div
                      className={classNames('app-table__expand-button', {
                        'is-expand': expands.has(id),
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
                      <Button pattern="link" icon={<Icon>{expands.has(id) ? <ArrowDropUpOutlined /> : <ArrowDropDownOutlined />}</Icon>} />
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </>
  );
}
