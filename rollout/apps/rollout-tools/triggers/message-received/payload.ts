import { defineTriggerPayloadSchema } from '@rollout/framework';

export const payloadSchema = defineTriggerPayloadSchema((t) => ({
  to: t.string({ title: 'To' }),
  from: t.string({ title: 'From' }),
  message: t.string({ title: 'Message' }),
}));
