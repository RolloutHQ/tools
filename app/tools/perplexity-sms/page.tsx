'use client';

// Import Rollout UI component CSS
import '@rollout/connect-react/default.css';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Container, Title, Text } from '@mantine/core';
import {
  AutomationCreator,
  AutomationsManager,
  RolloutConnectProvider,
} from '@rollout/connect-react';
import { createAutomation, getAutomations } from '@/lib/rollout-api';

// Helper function to create a second Rollout automation so we can send responses to Twilio
const createSecondAutomation = async (token: string, automation: any) => {
  const respondViaSmsAutomation = {
    name: 'Send Responses to Twilio',
    active: true,
    trigger: {
      appKey: 'rollout-tools',
      triggerKey: 'message-received',
      credentialKey: 'undefined',
      inputParams: {},
    },
    action: {
      appKey: 'twilio',
      actionKey: 'send-sms',
      credentialKey: automation.trigger.credentialKey,
      inputParams: {
        from: automation.trigger.inputParams.phoneNumbers[0],
        to: '{{from}}',
        message: '{{message}}',
      },
    },
  };
  await createAutomation(token, respondViaSmsAutomation);
};

// Helper function to display Rollout UI component to setup automation
const setupTwilioComponent = (fetchToken, handleAutomationCreated) => (
  <RolloutConnectProvider token={fetchToken} apiBaseUrl={process.env.NEXT_PUBLIC_ROLLOUT_BASE_URL!}>
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

export default function PerplexitySMSPage() {
  const { isSignedIn, user } = useUser();
  const [userId, setUserId] = useState(crypto.randomUUID());
  const [hasSetupAutomations, setHasSetupAutomations] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setUserId(user.id);
    }
  }, [user?.id, isSignedIn]);

  const fetchToken = async () => {
    const response = await fetch(`/tools/rollout-token?userId=${userId}`);
    const data = await response.json();
    return data.token;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await fetchToken();
      const automations = await getAutomations(token);
      setHasSetupAutomations(automations.length === 2);
    };
    fetchData();
  }, []);

  const handleAutomationCreated = async (automation: any) => {
    const token = await fetchToken();
    await createSecondAutomation(token, automation);
    setHasSetupAutomations(true);
  };

  return (
    <Container mt="3rem">
      <Title order={2} pb="lg">
        Search Perplexity via SMS
      </Title>
      {hasSetupAutomations ? (
        <Container>
          {setupTwilioComponent(fetchToken, handleAutomationCreated)}
          <Title order={3}>Twilio has been setup ✅</Title>
          <Text>Now send a message to your phone number to get a response</Text>
        </Container>
      ) : (
        setupTwilioComponent(fetchToken, handleAutomationCreated)
      )}
    </Container>
  );
}
