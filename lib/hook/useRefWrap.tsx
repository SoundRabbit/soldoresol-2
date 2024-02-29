import { useRef } from 'react';

export const useRefWrap = <T,>(currentValue: T) => {
  const ref = useRef<T>(currentValue);
  ref.current = currentValue;
  return ref;
};
