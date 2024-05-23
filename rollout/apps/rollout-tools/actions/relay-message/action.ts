import { defineAction } from '@rollout/framework';

import { inputParamsSchema } from './input';

export const action = defineAction()({
  name: 'Relay Message',
  inputParamsSchema,
  async execute({ resolvedInputParams }) {
    // Execute the action
    // Send HTTP request with message, to to backendURL

    console.log('Executing test-action', resolvedInputParams);
  },
});
