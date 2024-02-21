import { useCallback, useMemo } from 'react';
import useSWR from 'swr';

import { DataBlockId } from '@/dataBlock';
import { useSetState } from '@/hook/useSetState';
import { useTabIndex } from '@/hook/useTabIndex';

const SWR_KEY = 'local/modelessTab';

export const useSelectedChannelId = (tabId: string, channelIdList?: DataBlockId[]) => {
  const swrKey = [SWR_KEY, tabId, 'selectedChannelId'];

  const { data: maybeSelectedChannelId, mutate: mutateSelectedChannelId } = useSWR<DataBlockId>(swrKey, null);
  const selectedChannelId = useMemo(
    () => maybeSelectedChannelId ?? channelIdList?.at(0) ?? DataBlockId.none,
    [maybeSelectedChannelId, channelIdList],
  );

  const setSelectedChannelIdWithCallback = useCallback(
    (callback: (prevId: DataBlockId) => DataBlockId) => {
      mutateSelectedChannelId((prevId) => callback(prevId ?? DataBlockId.none), { revalidate: false });
    },
    [mutateSelectedChannelId],
  );

  const setSelectedChannelId = useSetState(setSelectedChannelIdWithCallback);

  return { selectedChannelId, setSelectedChannelId };
};

export const useSelectedChannelIdWithTabIndex = (tabId: string, channelIdList: DataBlockId[]) => {
  const { selectedChannelId: maybeSelectedChannelId, setSelectedChannelId } = useSelectedChannelId(tabId);
  const tabIndex = useTabIndex(maybeSelectedChannelId, channelIdList);

  const selectedChannelId = useMemo(
    () =>
      maybeSelectedChannelId !== DataBlockId.none ?
        maybeSelectedChannelId
      : channelIdList.at(tabIndex) ?? DataBlockId.none,
    [maybeSelectedChannelId, channelIdList, tabIndex],
  );

  return { selectedChannelId, setSelectedChannelId, tabIndex };
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
