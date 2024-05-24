'use client';

import {
  RolloutConnectProvider,
  AutomationCreator,
  AutomationsManager,
} from '@rollout/connect-react';
import { createAutomation } from '@/lib/rollout-api';

// Helper function to create a second Rollout automation so we can send responses to Twilio
const createSecondAutomation = async (token: string, automation: any) => {
  const respondViaSmsAutomation = {
    name: 'Send Responses to Twilio',
    active: true,
    trigger: {
      appKey: 'rollout-tools',
      triggerKey: 'message-received',
      credentialKey: automation.action.credentialKey,
      inputParams: {},
    },
    action: {
      appKey: 'twilio',
      actionKey: 'send-sms',
      credentialKey: automation.trigger.credentialKey,
      inputParams: {
        from: '{{to}}',
        to: '{{from}}',
        message: '{{message}}',
      },
    },
  };
  await createAutomation(token, respondViaSmsAutomation);
};

type SetupTwilioProps = {
  userId: string;
  setHasSetupAutomations: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SetupTwilio(props: SetupTwilioProps) {
  const { userId, setHasSetupAutomations } = props;
  const fetchToken = async () => {
    const response = await fetch(`/tools/rollout-token?userId=${userId}`);
    const data = await response.json();
    return data.token;
  };
  const handleAutomationCreated = async (automation: any) => {
    const token = await fetchToken();
    await createSecondAutomation(token, automation);
    setHasSetupAutomations(true);
  };

  return (
    <RolloutConnectProvider
      token={fetchToken}
      apiBaseUrl={process.env.NEXT_PUBLIC_ROLLOUT_BASE_URL!}
    >
      <AutomationCreator
        enableButtonText="Finish Setup"
        prefilled={{
          name: 'Relay Twilio SMS to server',
          trigger: {
            appKey: 'twilio',
            triggerKey: 'new-sms',
          },
          action: {
            appKey: 'rollout-tools',
            actionKey: 'relay-message',
            inputParams: {
              to: '{{to}}',
              from: '{{from}}',
              message: '{{body}}',
            },
          },
        }}
        renderFields={{
          action: false,
          name: false,
          trigger: ({ Card, TriggerCredentialKeyField, triggerInputFields }) => (
            <Card>
              Connect Twilio Account 🔗
              <TriggerCredentialKeyField />
              {triggerInputFields && (
                <Card>
                  Select Phone Number ☎️
                  <triggerInputFields.phoneNumbers variables={[]} />
                </Card>
              )}
            </Card>
          ),
        }}
        onAutomationCreated={(ctx) => {
          handleAutomationCreated(ctx.automation);
        }}
      />
      <AutomationsManager />
    </RolloutConnectProvider>
  );
}
