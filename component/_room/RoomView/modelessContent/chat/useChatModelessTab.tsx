import { useMemo } from 'react';
import { atomFamily, useRecoilValue, useSetRecoilState } from 'recoil';

import { DataBlockId } from '@/lib/dataBlock';
import { useTabIndex } from '@/lib/hook/useTabIndex';

const RECOIL_KEY = 'component/_room/RoomView/modelessContent/chat/useChatModelessTab';

const selectedChannelIdState = atomFamily<DataBlockId, string>({
  key: RECOIL_KEY + 'selectedChannelIdState',
  default: DataBlockId.none,
});

export const useSelectedChannelIdValue = (contentId: string, channelIdList?: DataBlockId[]) => {
  const maybeSelectedChannelId = useRecoilValue(selectedChannelIdState(contentId));

  const selectedChannelId = useMemo(
    () =>
      maybeSelectedChannelId !== DataBlockId.none ? maybeSelectedChannelId : channelIdList?.at(0) ?? DataBlockId.none,
    [maybeSelectedChannelId, channelIdList],
  );

  return { selectedChannelId };
};

export const useSetSelectedChannelId = (contentId: string) => {
  const setSelectedChannelId = useSetRecoilState(selectedChannelIdState(contentId));

  return { setSelectedChannelId };
};

export const useSelectedChannelIdValueWithTabIndex = (tabId: string, channelIdList: DataBlockId[]) => {
  const { selectedChannelId: maybeSelectedChannelId } = useSelectedChannelIdValue(tabId);
  const tabIndex = useTabIndex(maybeSelectedChannelId, channelIdList);

  const selectedChannelId = useMemo(
    () =>
      maybeSelectedChannelId !== DataBlockId.none ?
        maybeSelectedChannelId
      : channelIdList.at(tabIndex) ?? DataBlockId.none,
    [maybeSelectedChannelId, channelIdList, tabIndex],
  );

  return { selectedChannelId, tabIndex };
};
