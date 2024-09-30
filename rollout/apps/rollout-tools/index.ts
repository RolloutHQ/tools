import { defineApp } from '@rollout/framework';

import { actions } from './actions';
import { auth } from './auth';
import { http } from './http';
import { triggers } from './triggers';

export const app = defineApp({
  name: 'Rollout Tools',
  auth,
  http,
  triggers,
  actions,
});
