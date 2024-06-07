export {};

export interface AppListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  list: {
    title: React.ReactNode;
    avatar?: React.ReactNode;
    extra?: React.ReactNode;
    description?: React.ReactNode;
    footer?: React.ReactNode;
    props?: React.HTMLAttributes<HTMLLIElement>;
  }[];
  separator?: boolean;
}
