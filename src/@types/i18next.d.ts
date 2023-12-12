import 'i18next';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import resources from '../resources.json';

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    resources: (typeof resources)['en-US'];
  }
}
