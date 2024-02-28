import { useCallback, useRef } from 'react';

export const Ignored = Symbol('Ignored');

export const useMutex = () => {
  const mutexRef = useRef<boolean>(false);

  const runImmediately = useCallback(<T,>(atom: () => Promise<T>): Promise<T | typeof Ignored> => {
    if (mutexRef.current) return Promise.resolve(Ignored);
    mutexRef.current = true;
    return atom().finally(() => {
      mutexRef.current = false;
    });
  }, []);

  return {
    runImmediately,
  };
};
