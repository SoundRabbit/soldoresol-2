import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { DataBlockId } from '@/dataBlock';
import { useSetState } from '@/hook/useSetState';

const SWR_KEY = 'local/modelessTab';

export const useSelectedChannelIndex = (tabId: string) => {
  const swrKey = [SWR_KEY, tabId, 'selectedChannelIndex'];

  const { data: maybeSelectedChannelIndex, mutate: mutateSelectedChannelIndex } = useSWR<number>(swrKey, null);
  const selectedChannelIndex = useMemo(() => maybeSelectedChannelIndex ?? 0, [maybeSelectedChannelIndex]);

  const setSelectedChannelIndexWithCallback = useCallback(
    (callback: (prevIndex: number) => number) => {
      mutateSelectedChannelIndex((prevIndex) => callback(prevIndex ?? 0), { revalidate: false });
    },
    [mutateSelectedChannelIndex],
  );

  const setSelectedChannelIndex = useSetState(setSelectedChannelIndexWithCallback);

  return { selectedChannelIndex, setSelectedChannelIndex };
};

export const useSelectedTargetChannelIdList = (tabId: string) => {
  const swrKey = [SWR_KEY, tabId, 'selectedTargetChannelList'];

  const { data: maybeSelectedTargetChannelIdList, mutate: mutateSelectedTargetChannelIdList } = useSWR<DataBlockId[]>(
    swrKey,
    null,
  );
  const selectedTargetChannelIdList = useMemo(
    () => maybeSelectedTargetChannelIdList ?? [],
    [maybeSelectedTargetChannelIdList],
  );

  const setSelectedTargetChannelIdListWithCallback = useCallback(
    (callback: (prevList: DataBlockId[]) => DataBlockId[]) => {
      mutateSelectedTargetChannelIdList((prevList) => callback(prevList ?? []), { revalidate: false });
    },
    [mutateSelectedTargetChannelIdList],
  );

  const setSelectedTargetChannelIdList = useSetState(setSelectedTargetChannelIdListWithCallback);

  return { selectedTargetChannelIdList, setSelectedTargetChannelIdList };
};
