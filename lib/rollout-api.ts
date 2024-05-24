const jsonwebtoken = require('jsonwebtoken');

export const genToken = (userId: string) => {
  const nowSecs = Math.round(new Date().valueOf() / 1000);

  return jsonwebtoken.sign(
    {
      iss: 'tools',
      sub: userId,
      iat: nowSecs,
      exp: nowSecs + 60 * 60,
    },
    process.env.ROLLOUT_CLIENT_SECRET,
    { algorithm: 'HS512' }
  );
};
export const getAutomations = async (token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ROLLOUT_BASE_URL}/automations`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'any',
    },
  });
  const automations = await response.json();
  return automations;
};

export const createAutomation = async (token: string, automation: any) => {
  await fetch(`${process.env.NEXT_PUBLIC_ROLLOUT_BASE_URL!}/automations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(automation),
  });
};
