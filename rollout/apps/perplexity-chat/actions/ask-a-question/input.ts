import { defineActionInputParamsSchema } from '@rollout/framework';

export const inputParamsSchema = defineActionInputParamsSchema((t) => ({
  userId: t.string(),
  question: t.string(),
}));
