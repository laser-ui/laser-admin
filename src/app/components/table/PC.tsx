import type { AppTableProps } from './types';

import { Button, Checkbox, Dropdown, Separator, Spinner, Table } from '@laser-ui/components';
import { useImmer } from '@laser-ui/hooks';
import { classNames } from '@laser-ui/utils';
import { isUndefined } from 'lodash';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { getContent, getKey, toCssUnit } from './utils';

export function PC<T = any>(props: AppTableProps<T> & { grid: boolean; layout: 'default' | 'middle' | 'compact' }): JSX.Element | null {
  const { className, list, columns, selectable, actionOpts, expand: _expand, expandFixed, scroll, itemKey = getKey, grid, layout } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [expands, setExpands] = useImmer(new Set<any>());
  const leftFixed: { left?: number }[] = [{}, {}];

  const { ths, tds } = (() => {
    const ths: JSX.Element[] = [];
    const tds: ((data: T, index: number) => JSX.Element)[] = [];
    const left: string[] = [];
    if (_expand && expandFixed) {
      leftFixed[0].left = 0;
      left.push('60px');
    }
    if (selectable && selectable.fixed) {
      leftFixed[1].left = 'left' in leftFixed[0] ? 60 : 0;
      left.push('60px');
    }
    const right = columns.reduce((previous, current) => {
      if (current.fixed === 'R') {
        previous.push(toCssUnit(current.width!));
      }
      return previous;
    }, [] as string[]);
    if (actionOpts) {
      right.push(toCssUnit(actionOpts.width));
    }
    columns.forEach((column, index) => {
      if (!column.hidden) {
        const fixed: any = {};
        if (column.fixed === 'L') {
          fixed.left = `calc(${left.join(' + ')})`;
          left.push(toCssUnit(column.width!));
        } else if (column.fixed === 'R') {
          right.shift();
          fixed.right = `calc(${right.join(' + ')})`;
        }

        ths.push(
          <Table.Th
            key={index}
            styleOverrides={{ 'table__cell-text': { style: { whiteSpace: 'nowrap' } } }}
            width={column.width}
            sort={column.thProps?.sort}
            action={column.thProps?.action}
            fixed={{ top: 0, ...fixed }}
            align={column.align}
          >
            {column.th}
          </Table.Th>,
        );

        tds.push((data, dataIndex) => (
          <Table.Td
            key={index}
            styleOverrides={{ 'table__cell-text': { style: { whiteSpace: column.nowrap ? 'nowrap' : undefined } } }}
            width={column.width}
            fixed={fixed}
            align={column.align}
          >
            {getContent(column, data, dataIndex)}
          </Table.Td>
        ));
      }
    });
    return { ths, tds };
  })();

  return (
    <Table
      border={grid}
      className={classNames('d-none d-md-block', `app-table--${layout}`, className)}
      style={{
        maxHeight: scroll?.y,
        overflowX: isUndefined(scroll?.x) ? 'hidden' : 'auto',
        overflowY: isUndefined(scroll?.y) ? 'hidden' : 'auto',
      }}
    >
      <table style={{ minWidth: scroll?.x }}>
        <thead>
          <tr>
            {_expand && <Table.Th width={60} fixed={{ top: 0, ...leftFixed[0] }} />}
            {selectable && (
              <Table.Th
                styleOverrides={{ 'table__cell-text': { style: { display: 'inline-flex' } } }}
                width={60}
                align="center"
                fixed={{ top: 0, ...leftFixed[1] }}
              >
                <Checkbox
                  model={selectable.all === true}
                  indeterminate={selectable.all === 'mixed'}
                  onModelChange={selectable.onAllChange}
                />
              </Table.Th>
            )}
            {ths}
            {actionOpts && (
              <Table.Th
                styleOverrides={{ 'table__cell-text': { style: { whiteSpace: 'nowrap' } } }}
                width={actionOpts.width}
                fixed={{ top: 0, right: 0 }}
              >
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
              const selectNode = selectable && selectable.item(data, index);

              return (
                <Fragment key={id}>
                  <tr>
                    {_expand && (
                      <Table.Td width={60} align="center" fixed={leftFixed[0]}>
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
                    {selectNode && (
                      <Table.Td
                        styleOverrides={{ 'table__cell-text': { style: { display: 'inline-flex' } } }}
                        width={60}
                        align="center"
                        fixed={leftFixed[1]}
                      >
                        <Checkbox model={selectNode.checked} onModelChange={selectNode.onChange} />
                      </Table.Td>
                    )}
                    {tds.map((td) => td(data, index))}
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
                                    list={actions.slice(1).map((action, actionIndex) => ({
                                      id: actionIndex + 1,
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
                              return actions.map((action, actionIndex) => (
                                <Fragment key={actionIndex}>
                                  {getAction(action)}
                                  {actionIndex !== actions.length - 1 && <Separator vertical />}
                                </Fragment>
                              ));
                            }
                          })()}
                        </div>
                      </Table.Td>
                    )}
                  </tr>
                  {_expand && (
                    <tr style={{ display: expands.has(id) ? undefined : 'none' }}>
                      <td colSpan={1 + (selectable ? 1 : 0) + ths.length + (actionOpts ? 1 : 0)}>
                        {_expand(data, index, expands.has(id))}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </Table>
  );
}
