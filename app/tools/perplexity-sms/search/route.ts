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
  const { data, error: readError } = await supabase
    .from('perplexity-chat')
    .select('chat_history')
    .eq('user_id', requestData.from)
    .limit(1)
    .single();
  if (readError) {
    throw new Error(readError.message);
  }

  // Get answer from Perplexity API
  let messages;
  const userQuestion: ChatEntry = {
    role: 'user',
    content: requestData.message,
  };

  if (data != null) {
    messages = [SYSTEM_PROMPT, userQuestion];
  } else {
    messages = [...(data as ChatHistory).chat_history, userQuestion];
  }
  const answer = await askPerplexity(messages);

  // Add response to chat history
  messages.push(answer);
  const { error: writeError } = await supabase
    .from('perplexity-chat')
    .update({ chat_history: messages })
    .eq('user_id', requestData.from);
  if (writeError) {
    throw new Error(writeError.message);
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
          from: requestData.from,
          message: requestData.message,
        },
      }),
    }
  );

  return NextResponse.json({ data }, { status: triggerEvent.status });
}
