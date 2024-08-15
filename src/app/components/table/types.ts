export {};

export interface AppTableColumn<T> {
  key?: string;
  th: string;
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
  fixed?: 'L' | 'R';
  align?: 'left' | 'right' | 'center';
  copyable?: boolean;
  nowrap?: boolean;
  hidden?: boolean;
  asTitle?: boolean;
}

export interface AppTableProps<T> {
  id?: string;
  className?: string;
  name?: React.ReactNode;
  tools?: ('refresh' | 'grid' | 'layout' | 'settings')[];
  list: T[];
  columns: AppTableColumn<T>[];
  selectable?: {
    fixed?: boolean;
    all: boolean | 'mixed';
    onAllChange: (checked: boolean) => void;
    item: (data: T, index: number) => { checked: boolean; onChange: (checked: boolean) => void };
  };
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
  expand?: (data: T, index: number, expand: boolean) => React.ReactNode;
  expandFixed?: boolean;
  grid?: boolean;
  layout?: 'default' | 'middle' | 'compact';
  scroll?: { x?: number | string; y?: number | string };
  itemKey?: (data: T, index: number) => any;
  onRefresh?: () => void;
  render?: (table: React.ReactElement) => React.ReactNode;
}
