'use client';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

type TestTriggerButtonProps = {
  fetchToken: () => Promise<string>;
  baseUrl: string;
};

export function TestTriggerButton(props: TestTriggerButtonProps) {
  const { fetchToken, baseUrl } = props;
  const testTrigger = async () => {
    try {
      const token = await fetchToken();
      const resp = await fetch(`${baseUrl}/trigger-push-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        redirect: 'follow',
        body: JSON.stringify({
          appKey: 'rollout-automate',
          triggerKey: 'test-trigger',
          payload: {
            name: 'Test Automation',
            id: '123456',
            eventName: 'Test Trigger',
            eventTime: new Date().toString(),
            submittedBy: 'Logged in user',
            email: 'support@rollout.com',
          },
        }),
      });
      notifications.show({
        title: 'Trigger Event Sent! ✈️',
        message: `Got server response with status: ${resp.status}`,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Button mt="md" style={{ float: 'right' }} onClick={testTrigger}>
      Test Trigger
    </Button>
  );
}
