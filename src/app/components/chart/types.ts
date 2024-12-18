import type { AppTheme } from '../../types';

export {};

export interface AppChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<{
    setOption: (base: any, update?: any) => void;
  }>;
  theme?: AppTheme;
  autoResize?: boolean;
  autoResizeDebounce?: number;
}
