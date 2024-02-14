import { useCallback, useMemo } from 'react';
import useSWR from 'swr';

export const useChatModelessTab = (tabId: string) => {
  const swrKeyBase = `local/modelessTab/${tabId}`;

  const { data: maybeSelectedChannelIndex, mutate: mutateSelectedChannelIndex } = useSWR<number>(
    `${swrKeyBase}/selectedChannelIndex`,
    null,
  );
  const selectedChannelIndex = useMemo(() => maybeSelectedChannelIndex ?? 0, [maybeSelectedChannelIndex]);

  const setSelectedChannelIndex = useCallback(
    (index: number) => {
      mutateSelectedChannelIndex(index, { revalidate: false });
    },
    [mutateSelectedChannelIndex],
  );

  return {
    selectedChannelIndex,
    setSelectedChannelIndex,
  };
};
