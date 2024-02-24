export const loadWorker = () => {
  return new Worker(new URL('./worker.ts', import.meta.url));
};
