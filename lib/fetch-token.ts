export const fetchToken = async (userId: string) => {
  const response = await fetch(`/tools/rollout-token?userId=${userId}`);
  const data = await response.json();
  return data.token;
};
