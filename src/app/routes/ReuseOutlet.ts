import { createReuseOutlet } from '@laser-ui/admin';

export const ReuseOutlet = createReuseOutlet(new Map([['/list/standard-table', ['/list/standard-table/:id']]]), {
  scrollSelector: '#app-main',
});
