'use-client';

import '@rollout/connect-react/default.css';

import {
  RolloutConnectProvider,
  AutomationsManager,
  AutomationCreator,
} from '@rollout/connect-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TestTriggerButton } from './TriggerTestButton';

const ROLLOUT_BASE_URL = 'https://rollout-tools.rolloutapp.com/api';

type AutomationManagerProps = {
  userId: string;
};

const getAutomations = async (token: string) => {
  const response = await fetch(`${ROLLOUT_BASE_URL}/automations`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const automations = await response.json();
  return automations;
};

export function WorkflowBuilder(props: AutomationManagerProps) {
  const { userId } = props;
  const searchParams = useSearchParams();
  const showDevTools = searchParams.get('dev');
  const [hasAutomations, setHasAutomations] = useState(false);

  const fetchToken = async () => {
    const response = await fetch(`/tools/rollout-token?userId=${userId}`);
    const data = await response.json();
    return data.token;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await fetchToken();
      const automations = await getAutomations(token);
      setHasAutomations(automations.length > 0);
    };
    fetchData();
  }, []);

  return (
    <>
      <RolloutConnectProvider token={fetchToken} apiBaseUrl={ROLLOUT_BASE_URL!}>
        {hasAutomations ? (
          <AutomationsManager />
        ) : (
          <AutomationCreator
            prefilled={{
              name: 'My First Automation',
            }}
            onAutomationCreated={() => setHasAutomations(true)}
          />
        )}
      </RolloutConnectProvider>
      {showDevTools && <TestTriggerButton fetchToken={fetchToken} baseUrl={ROLLOUT_BASE_URL} />}
    </>
  );
}
