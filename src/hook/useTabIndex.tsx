import { useMemo, useRef } from 'react';

export const useTabIndex = <T,>(selectedId: T, idList: T[]) => {
  const lastTabIndexRef = useRef(0);
  const tabIndex = useMemo(() => {
    const tabIndex = idList.findIndex((id) => id === selectedId);
    const tailIndex = Math.max(0, idList.length - 1);
    if (tabIndex !== -1) {
      lastTabIndexRef.current = Math.min(tabIndex, tailIndex);
    } else {
      lastTabIndexRef.current = Math.min(lastTabIndexRef.current, tailIndex);
    }
    return lastTabIndexRef.current;
  }, [idList, selectedId]);
  return tabIndex;
};
