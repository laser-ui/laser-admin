import type { AppTheme } from '../../types';

export {};

export interface AppChartRef {
  setOption: (base: any, update?: any) => void;
}

export interface AppChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<AppChartRef>;
  theme?: AppTheme;
  autoResize?: boolean;
  autoResizeDebounce?: number;
}
