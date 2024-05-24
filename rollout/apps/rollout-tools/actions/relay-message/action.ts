import { defineAction } from '@rollout/framework';

import { inputParamsSchema } from './input';

export const action = defineAction()({
  name: 'Relay Message',
  inputParamsSchema,
  async execute({ resolvedInputParams, credential }) {
    // Execute the action
    // Send HTTP request with message, to to backendURL
    const url = `${process.env.BACKEND_BASE_URL}/tools/perplexity-sms/search`;
    const options = {
      method: 'POST',
      headers: { Authorization: process.env.BACKEND_AUTH_TOKEN! },
      body: JSON.stringify({
        to: resolvedInputParams.to,
        from: resolvedInputParams.from,
        message: resolvedInputParams.message,
        userId: credential.credentialKey,
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
    } catch (error) {
      console.log('error', JSON.stringify(error));
      console.error(error);
    }
  },
});
