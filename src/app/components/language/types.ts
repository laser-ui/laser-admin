export {};

export interface AppLanguageProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  trigger?: 'click' | 'hover';
}
