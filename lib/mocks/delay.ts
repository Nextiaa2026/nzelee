/** Simulated latency for mock `useQuery` loaders (swap for real `fetch` later). */
export const MOCK_NETWORK_MS = 180;

export async function mockNetworkDelay(ms: number = MOCK_NETWORK_MS) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
