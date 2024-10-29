import { definePollingTrigger } from '@rollout/framework';

import { inputParamsSchema } from './input';
import { payloadSchema } from './payload';

type State = string[];

export const trigger = definePollingTrigger<never, State>()({
  name: 'Test Polling Trigger',
  inputParamsSchema,
  payloadSchema,
  async poll({ prevState }) {
    const d = new Date();

    return {
      newState: [...prevState ?? [], d.toISOString()],
      events: [
        {
          name: d.toISOString(),
        },
      ],
    };
  },
});
