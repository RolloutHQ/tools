import { definePushTrigger } from '@rollout/framework';

import { inputParamsSchema } from './input';
import { payloadSchema } from './payload';

export const trigger = definePushTrigger()({
  name: 'Message Received',
  inputParamsSchema,
  payloadSchema,
});
