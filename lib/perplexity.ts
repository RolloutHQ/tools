// Defines a single chat entry with the role and content of the message
export interface ChatEntry {
  role: 'system' | 'user' | 'assistant'; // Enumerates possible roles
  content: string;
}

// Defines the entire chat history as an array of chat entries
export interface ChatHistory {
  chat_history: ChatEntry[];
}

export const askPerplexity = async (messages: ChatEntry[]) => {
  console.log('asking perplexity');
  const url = 'https://api.perplexity.ai/chat/completions';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${process.env.PPLX_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3-sonar-small-32k-online',
      messages,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.choices[0].message;
  } catch (error) {
    console.error(error);
    return null;
  }
};
