import type { AppTableProps } from './types';

import { Mobile } from './Mobile';
import { PC } from './PC';

export function AppSimpleTable<T = any>(props: Omit<AppTableProps<T>, 'tools'>): JSX.Element | null {
  const { name, grid = false, layout = 'default' } = props;

  return (
    <>
      {name && (
        <div className="app-table__header">
          {name && <div className="app-table__title">{name}</div>}
          {(props as any)._actions}
        </div>
      )}
      <PC {...props} grid={grid} layout={layout} />
      <Mobile {...props} grid={grid} layout={layout} />
    </>
  );
}
