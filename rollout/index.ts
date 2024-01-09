import { setupRollout } from '@rollout/framework';

import { myApps } from './apps';

export const config = setupRollout({
  apps: (apps) => ({
    // Spread all your apps
    ...myApps,
    // Spread all apps provided by Rollout, or pick ones you want to use
    ...apps,
  }),

  async onAutomationRunResults({ execution, automation, triggerEvent }) {
    // POST automation results to your backend
  },
});
