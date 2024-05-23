import { defineActionInputParamsSchema } from '@rollout/framework';

export const inputParamsSchema = defineActionInputParamsSchema((t) => ({
  from: t.string({ title: 'From' }),
  message: t.string({ title: 'Message' }),
}));
