import { trigger as myPushTrigger } from './test-trigger/trigger';
import { trigger as messageReceived } from './message-received/trigger';

export const triggers = {
  'test-trigger': myPushTrigger,
  'message-received': messageReceived,
};
