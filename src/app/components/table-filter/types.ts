export {};

export interface AppTableFilterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  filterList?: { label: string; node: React.ReactElement; isEmpty: boolean }[];
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchValueChange?: (value: string) => void;
  onSearchClick?: () => void;
  onResetClick?: () => void;
}
