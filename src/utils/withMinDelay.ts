const MIN_LOADING_MS = 400;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const withMinDelay = async <T>(
  promise: Promise<T>,
  ms: number = MIN_LOADING_MS,
): Promise<T> => {
  const [result] = await Promise.all([promise, sleep(ms)]);
  return result;
};
