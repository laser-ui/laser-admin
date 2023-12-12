export {};

export interface AppStatusDotProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  color?: string;
  size?: string | number;
  wave?: boolean;
}
