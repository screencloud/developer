import type { GatsbyBrowser } from 'gatsby';

export const onServiceWorkerUpdateReady: GatsbyBrowser['onServiceWorkerUpdateReady'] = () => {
  const answer = window.confirm(
    `This tutorial has been updated. ` + `Reload to display the latest version?`
  );

  if (answer === true) {
    window.location.reload();
  }
};
