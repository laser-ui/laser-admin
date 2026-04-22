import type resources from '../resources';

import 'i18next';

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    resources: (typeof resources)['en-US'];
  }
}
