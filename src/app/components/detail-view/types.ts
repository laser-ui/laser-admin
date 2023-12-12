export {};

export interface AppDetailViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: {
    label: string;
    content: React.ReactNode;
    isEmpty?: boolean;
    center?: boolean;
  }[];
  col?: number | true | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number | true>>;
  gutter?: number | [number?, number?];
  labelAlign?: 'left' | 'center' | 'right';
  labelWidth?: string | number;
  empty?: React.ReactNode;
  vertical?: boolean;
}
