import { action as testAction } from './test-action/action';
import { action as relayMessage } from './relay-message/action';

export const actions = {
  'test-action': testAction,
  'relay-message': relayMessage,
};
