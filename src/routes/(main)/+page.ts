import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  return {
    isRoot: true,
    maxWidth: '30em',
  };
};
