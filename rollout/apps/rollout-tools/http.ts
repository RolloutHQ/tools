import { Elysia, t } from 'elysia';

import {
  defineHTTPHandler,
  handleConsumerRequest,
  handlePushTriggerEvent,
  waitForAutomationRunResult,
  getAutomation
} from '@rollout/framework';

const router = new Elysia()
.post(
  '/run-automation/:automationId',
  async ({ body, params, request }) => {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Response('No Authorization with Bearer token set', { status: 401 });
    }

    const requestValidation = await handleConsumerRequest({ token });

    if (!requestValidation.ok) {
      throw new Response(requestValidation.error, { status: 401 });
    }

    const automation = await getAutomation({
      where: {
        id: params.automationId,
      },
    });
    
    if (automation.consumerKey !== requestValidation.consumer.consumerKey) {
      throw new Response("Automation not found", { status: 400 });
    }

    if (!automation.live) {
      throw new Response("Automation is not live", { status: 400 });
    }

    const { automationRun } = await handlePushTriggerEvent({
      automationId: params.automationId,
      payload: body.payload,
      addToQueueFront: true,
    });

    const { execution } = await waitForAutomationRunResult({
      automationRunId: automationRun.id,
    });

    return { execution };
  },
  {
    body: t.Object({
      payload: t.Record(t.String(), t.Any()),
    }),
  }
);

export const http = defineHTTPHandler(router.handle);
