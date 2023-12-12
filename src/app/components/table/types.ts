export {};

export interface AppTableColumn<T> {
  th: React.ReactNode;
  thProps?: {
    sort?: {
      options?: ('ascend' | 'descend' | null)[];
      active?: 'ascend' | 'descend' | null;
      onChange?: (order: 'ascend' | 'descend' | null) => void;
    };
    action?: React.ReactNode;
  };
  td: ((data: T, index: number) => React.ReactNode) | string;
  width?: number | string;
  fixed?: {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
  };
  align?: 'left' | 'right' | 'center';
  title?: boolean;
  checkbox?: boolean;
  nowrap?: boolean;
  hidden?: boolean;
}

export interface AppTableProps<T> {
  className?: string;
  name?: string;
  list: T[];
  columns: AppTableColumn<T>[];
  actionOpts?: {
    actions: (
      data: T,
      index: number,
    ) => {
      text: string;
      onclick?: () => void;
      link?: string;
      render?: (node: React.ReactElement) => React.ReactNode;
      loading?: boolean;
      hidden?: boolean;
    }[];
    width: number | string;
  };
  expand?: (data: T, index: number) => React.ReactNode;
  expandFixed?: {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
  };
  scroll?: { x?: number | string; y?: number | string };
  itemKey?: (data: T, index: number) => any;
}
