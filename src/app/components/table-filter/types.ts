export {};

export interface AppTableFilterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  filterList?: { label: string; node: React.ReactElement; value: any }[];
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchValueChange?: (value: string) => void;
  onSearchClick?: () => void;
  onResetClick?: () => void;
}
