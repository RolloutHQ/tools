import { defineTriggerPayloadSchema } from '@rollout/framework';

export const payloadSchema = defineTriggerPayloadSchema((t) => ({
  id: t.string({ title: 'ID' }),
  name: t.string({ title: 'Name' }),
  eventName: t.string({ title: 'Event Name' }),
  eventTime: t.string({ title: 'Event Time' }),
  submittedBy: t.string({ title: 'Submitted By' }),
  email: t.string({ title: 'Email' }),
}));
