import { definePollingTrigger } from '@rollout/framework';
import { randomInt } from "node:crypto";
import { inputParamsSchema } from './input';
import { payloadSchema } from './payload';
import { setTimeout } from 'node:timers/promises';

type State = { date: string; pod: number }[];
const pod = randomInt(100);

export const trigger = definePollingTrigger<never, State>()({
  name: 'Test Polling Trigger',
  inputParamsSchema,
  payloadSchema,
  async poll({ prevState }) {
    const d = new Date();

    await setTimeout(100 + 300 * Math.random());

    return {
      newState: [...prevState ?? [], { date: d.toISOString(), pod }],
      events: [
        {
          name: d.toISOString(),
          pod,
        },
      ],
    };
  },
});
