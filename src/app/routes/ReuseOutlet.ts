import { createReuseOutlet } from '@laser-pro/router';

export const ReuseOutlet = createReuseOutlet(new Map([['/list/standard-table', ['/list/standard-table/:id']]]), {
  scrollSelector: '#app-main',
});
