import type { PageLoad } from './$types';

export const load: PageLoad = () => ({
  isRoot: true,
  maxWidth: '30em',
});
