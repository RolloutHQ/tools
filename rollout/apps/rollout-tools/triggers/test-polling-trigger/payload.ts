import { defineTriggerPayloadSchema } from '@rollout/framework';

export const payloadSchema = defineTriggerPayloadSchema((t) => ({
  name: t.string({ title: 'Name' }),
}));
