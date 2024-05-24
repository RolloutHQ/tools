'use client';

// Import Rollout UI component CSS
import '@rollout/connect-react/default.css';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Container, Title, Text } from '@mantine/core';
import { getAutomations } from '@/lib/rollout-api';
import { fetchToken } from '@/lib/fetch-token';
import { SetupTwilio } from '@/components/perplexity-sms/SetupTwilio';

export default function PerplexitySMSPage() {
  const { isSignedIn, user } = useUser();
  const [userId, setUserId] = useState('');
  const [hasSetupAutomations, setHasSetupAutomations] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setUserId(user.id);
    } else {
      setHasSetupAutomations(false);
    }
  }, [user?.id, isSignedIn]);

  useEffect(() => {
    const fetchData = async (consumerKey: string) => {
      const token = await fetchToken(consumerKey);
      const automations = await getAutomations(token);
      setHasSetupAutomations(automations.length > 1);
    };
    if (userId != '') {
      fetchData(userId);
    }
  }, [userId]);

  return (
    <Container mt="3rem">
      <Title order={2} pb="lg">
        Search Perplexity via SMS
      </Title>
      {hasSetupAutomations ? (
        <Container>
          <Title order={3}>Twilio has been setup ✅</Title>
          <Text>Now send a message to your phone number to get a response</Text>
        </Container>
      ) : (
        <SetupTwilio userId={userId} setHasSetupAutomations={setHasSetupAutomations} key={userId} />
      )}
    </Container>
  );
}
