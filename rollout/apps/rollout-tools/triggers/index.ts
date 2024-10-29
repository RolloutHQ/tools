import { trigger as myPushTrigger } from './test-trigger/trigger';
import { trigger as messageReceived } from './message-received/trigger';
import { trigger as testPollingTrigger } from './test-polling-trigger/trigger';

export const triggers = {
  'test-trigger': myPushTrigger,
  'message-received': messageReceived,
  'test-polling-trigger': testPollingTrigger,
};
