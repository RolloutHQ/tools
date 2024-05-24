import { defineActionInputParamsSchema } from '@rollout/framework';

export const inputParamsSchema = defineActionInputParamsSchema((t) => ({
  from: t.string({ title: 'From' }),
  to: t.string({ title: 'To' }),
  message: t.string({ title: 'Message' }),
}));
