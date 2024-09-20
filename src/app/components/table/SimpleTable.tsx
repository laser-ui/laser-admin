import type { AppTableProps } from './types';

import { Mobile } from './Mobile';
import { PC } from './PC';
import { useMatchMedia } from '../../hooks';

export function AppSimpleTable<T = any>(props: Omit<AppTableProps<T>, 'tools'>): JSX.Element | null {
  const { name, grid = false, layout = 'default', render } = props;

  const { mediaBreakpointUp } = useMatchMedia();

  const table = mediaBreakpointUp('md') ? <PC {...props} grid={grid} layout={layout} /> : <Mobile {...props} grid={grid} layout={layout} />;

  return (
    <>
      {name && (
        <div className="app-table__header">
          {name && <div className="app-table__title">{name}</div>}
          {(props as any)._actions}
        </div>
      )}
      {render ? render(table) : table}
    </>
  );
}
