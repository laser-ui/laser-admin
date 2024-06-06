import type { AppTheme } from '../../types';

export {};

export interface AppChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  theme?: AppTheme;
  autoResize?: boolean;
  autoResizeDebounce?: number;
}
