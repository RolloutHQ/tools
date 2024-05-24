import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ChatHistory, ChatEntry, askPerplexity } from '@/lib/perplexity';
import { genToken } from '@/lib/rollout-api';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT: ChatEntry = {
  role: 'system',
  content:
    'You are an SMS based search engine. Be precise and extremely concise, ensure your response are 160 characters or less.',
};

export async function POST(request: Request) {
  // Verify request
  const authorized = request.headers.get('authorization') === process.env.ROLLOUT_TOOLS_SECRET;
  if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Ready Request body
  const requestData = await request.json();

  // Fetch conversation history from DB
  const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');
  let historyData = null;
  const { data, error: readError } = await supabase
    .from('perplexity-chat')
    .select('chat_history')
    .eq('user_id', requestData.from)
    .limit(1)
    .single();
  if (readError) {
    console.log('No existing chat history found for this phone number');
  } else {
    historyData = data;
  }

  // Get answer from Perplexity API
  let messages;
  const userQuestion: ChatEntry = {
    role: 'user',
    content: requestData.message,
  };

  if (historyData == null) {
    messages = [SYSTEM_PROMPT, userQuestion];
  } else {
    messages = [...(historyData as ChatHistory).chat_history, userQuestion];
  }
  const answer = await askPerplexity(messages);

  // Add response to chat history or create a new entry if none exists
  messages.push(answer);
  if (historyData) {
    await supabase
      .from('perplexity-chat')
      .update({ chat_history: messages })
      .eq('user_id', requestData.from);
  } else {
    await supabase
      .from('perplexity-chat')
      .insert({ chat_history: messages, user_id: requestData.from });
  }

  // Send trigger event
  const token = genToken(requestData.userId);

  const triggerEvent = await fetch(
    `${process.env.NEXT_PUBLIC_ROLLOUT_BASE_URL}/trigger-push-event`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        appKey: 'rollout-tools',
        triggerKey: 'message-received',
        payload: {
          to: requestData.to,
          from: requestData.from,
          message: answer.content,
        },
      }),
    }
  );

  return NextResponse.json({ data }, { status: triggerEvent.status });
}
