import type { PageLoad } from './$types';

export const load: PageLoad = () => ({
  layout: { isRoot: true, maxWidth: '30em' },
});
