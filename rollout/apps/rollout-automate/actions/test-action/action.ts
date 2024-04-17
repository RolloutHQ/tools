import { defineAction } from '@rollout/framework';

import { inputParamsSchema } from './input';

export const action = defineAction()({
  name: 'Test action',
  inputParamsSchema,
  async execute({ resolvedInputParams }) {
    // Execute the action
    console.log('Executing test-action', resolvedInputParams);
  },
});
