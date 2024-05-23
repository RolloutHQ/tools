import { defineTriggerPayloadSchema } from '@rollout/framework';

export const payloadSchema = defineTriggerPayloadSchema((t) => ({
  from: t.string({ title: 'From' }),
  message: t.string({ title: 'Message' }),
}));
