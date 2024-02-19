import { useCallback, useRef, useState } from 'react';
import { useSetState } from './useSetState';

export const useRefState = <T,>(initialState: T) => {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  const setStateCallback = useCallback((callback: (prevState: T) => T) => {
    setState((prevState) => {
      const newState = callback(prevState);
      stateRef.current = newState;
      return newState;
    });
  }, []);

  const setStateRef = useSetState(setStateCallback);

  return [state, stateRef, setStateRef] as const;
};
