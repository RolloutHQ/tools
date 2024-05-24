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
import { getAutomations } from '@/lib/rollout-api';

type AutomationManagerProps = {
  userId: string;
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
      <RolloutConnectProvider
        token={fetchToken}
        apiBaseUrl={process.env.NEXT_PUBLIC_ROLLOUT_BASE_URL!}
      >
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
      {showDevTools && (
        <TestTriggerButton
          fetchToken={fetchToken}
          baseUrl={process.env.NEXT_PUBLIC_ROLLOUT_BASE_URL!}
        />
      )}
    </>
  );
}
