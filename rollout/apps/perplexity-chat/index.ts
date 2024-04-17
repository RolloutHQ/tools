import { defineApp } from '@rollout/framework';

import { actions } from './actions';
import { http } from './http';
import { triggers } from './triggers';

export const app = defineApp({
  name: 'Perplex Chat',
  auth: false,
  http,
  triggers,
  actions,
});
