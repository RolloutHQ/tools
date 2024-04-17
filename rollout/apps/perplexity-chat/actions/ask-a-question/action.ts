import { defineAction } from '@rollout/framework';
import { createClient } from '@supabase/supabase-js';
import { ChatHistory, ChatEntry, askPerplexity } from '../../lib/perplexity';

import { inputParamsSchema } from './input';

const SYSTEM_PROMPT: ChatEntry = {
  role: 'system',
  content:
    'You are an SMS based search engine. Be precise and extremely concise, ensure your response are 160 characters or less.',
};

export const action = defineAction()({
  name: 'Ask a question',
  inputParamsSchema,
  async execute({ resolvedInputParams }) {
    const { userId, question } = resolvedInputParams;

    // Fetch conversation history from DB
    const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');
    const { data, error: readError } = await supabase
      .from('perplexity-chat')
      .select('chat_history')
      .eq('user_id', userId)
      .limit(1)
      .single();
    if (readError) {
      throw new Error(readError.message);
    }

    // Get answer from Perplexity API
    let messages;
    const userQuestion: ChatEntry = {
      role: 'user',
      content: question,
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
      .eq('user_id', userId);
    if (writeError) {
      throw new Error(writeError.message);
    }

    // Send trigger event
    // console.log('Executing my-action', resolvedInputParams);
  },
});
