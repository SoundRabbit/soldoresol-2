import { useCallback } from 'react';

type SetStateCallback<T> = (prevState: T) => T;

export const useSetState = <T,>(setStateCallback: (callback: SetStateCallback<T>) => void) => {
  const setState = useCallback(
    (state: T | SetStateCallback<T>) => {
      if (typeof state === 'function') {
        setStateCallback(state as SetStateCallback<T>);
      } else {
        const callback = (prevState: T) => state as T;
        setStateCallback(callback);
      }
    },
    [setStateCallback],
  );
  return setState;
};
