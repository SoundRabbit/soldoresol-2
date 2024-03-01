import { useEffect } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { DataBlockTableChannel } from '@/lib/dataBlockTable';

const RECOIL_KEY = 'lib/hook/useDataBlockTableChannelState';
const DATA_BLOCK_TABLE_CHANNEL_STATE_KEY = RECOIL_KEY + ':dataBlockTableChannel';

const dataBlockTableChannelState = atom<DataBlockTableChannel>({
  key: DATA_BLOCK_TABLE_CHANNEL_STATE_KEY,
  default: DataBlockTableChannel.$default,
});

export const useDataBlockTableChannelValue = () => {
  const dataBlockTableChannel = useRecoilValue(dataBlockTableChannelState);
  return dataBlockTableChannel;
};

export const useSetDataBlockTableChannelEffect = () => {
  const setDataBlockTableChannel = useSetRecoilState(dataBlockTableChannelState);
  useEffect(() => {
    setDataBlockTableChannel((prevChannel) => {
      prevChannel.worker?.port.close();
      return DataBlockTableChannel.create();
    });
  }, [setDataBlockTableChannel]);
};
