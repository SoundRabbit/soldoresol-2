import { produce } from 'immer';
import { useMemo } from 'react';
import { atomFamily, selectorFamily, useRecoilCallback, useRecoilValue } from 'recoil';

import { DataBlock, DataBlockId } from '@/lib/dataBlock';
import { DataBlockTableChannel } from '@/lib/dataBlockTable';
import { useDataBlockTableChannelValue } from '@/lib/hook/useDataBlockTableChannelState';
import { useRefWrap } from '@/lib/hook/useRefWrap';
import { RoomId, useRoomIdValue } from '@/lib/hook/useRoomState';

import { Maybe } from '../type/utilityTypes';

const RECOIL_KEY = 'lib/hook/useDataBlock:';
const DATA_BLOCK_TABLE_STATE_KEY = RECOIL_KEY + 'dataBlockTable';
const DATA_BLOCK_LIST_STATE_KEY = RECOIL_KEY + 'dataBlockList';
const DATA_BLOCK_STATE_KEY = RECOIL_KEY + 'dataBlock';

type DataBlockTable = Record<DataBlockId, Maybe<DataBlock>>;

const dataBlockTableState = atomFamily<DataBlockTable, DataBlockId>({
  key: DATA_BLOCK_TABLE_STATE_KEY,
  default: {},
});

const dataBlockSelector = selectorFamily<Maybe<DataBlock>, [RoomId, DataBlockId]>({
  key: DATA_BLOCK_STATE_KEY,
  get:
    ([roomId, dataBlockId]) =>
    ({ get }) => {
      if (roomId === '') return undefined;

      const dataBlockTable = get(dataBlockTableState(roomId));

      return dataBlockTable[dataBlockId];
    },
  set:
    ([roomId, dataBlockId]) =>
    ({ set }, newDataBlock) => {
      set(
        dataBlockTableState(roomId),
        produce((draft) => {
          if (roomId === '') return;
          if (DataBlock.is(newDataBlock) && newDataBlock.id === dataBlockId) {
            draft[dataBlockId] = newDataBlock;
          } else if (typeof newDataBlock === 'undefined') {
            delete draft[dataBlockId];
          }
        }),
      );
    },
});

const dataBlockListSelector = selectorFamily<DataBlock[], [RoomId, DataBlockId[]]>({
  key: DATA_BLOCK_LIST_STATE_KEY,
  get:
    ([roomId, dataBlockIdList]) =>
    ({ get }) => {
      if (roomId === '') return [];
      const dataBlockList = dataBlockIdList
        .map((dataBlockId) => get(dataBlockSelector([roomId, dataBlockId])))
        .filter(DataBlock.is);
      return dataBlockList;
    },
});

export const useDataBlockTable = () => {
  const tableChannel = useDataBlockTableChannelValue();
  const roomId = useRoomIdValue();

  const set = useRecoilCallback(
    ({ set, snapshot }) =>
      async (dataBlock: DataBlock) => {
        if (roomId === '') return;

        const prevDataBlock = await snapshot.getPromise(dataBlockSelector([roomId, dataBlock.id]));
        set(dataBlockSelector([roomId, dataBlock.id]), dataBlock);

        const dataBlockId = await DataBlockTableChannel.set(tableChannel, roomId, dataBlock.id, dataBlock);
        if (!dataBlockId) {
          set(dataBlockSelector([roomId, dataBlock.id]), prevDataBlock);
        }

        return dataBlockId;
      },
    [tableChannel, roomId],
  );

  const remove = useRecoilCallback(
    ({ set, snapshot }) =>
      async (dataBlockId: DataBlockId) => {
        if (roomId === '') return;

        const prevDataBlock = await snapshot.getPromise(dataBlockSelector([roomId, dataBlockId]));
        set(dataBlockSelector([roomId, dataBlockId]), undefined);

        const removedDataBlockId = await DataBlockTableChannel.remove(tableChannel, roomId, dataBlockId);
        if (!removedDataBlockId) {
          set(dataBlockSelector([roomId, dataBlockId]), prevDataBlock);
        }

        return dataBlockId;
      },
    [tableChannel, roomId],
  );

  return useMemo(
    () => ({
      set,
      remove,
    }),
    [set, remove],
  );
};

export const useDataBlockValue = <T extends DataBlock>(
  dataBlockId: DataBlockId,
  typeChecker: (data: DataBlock) => data is T,
) => {
  const roomId = useRoomIdValue();

  const dataBlock = useRecoilValue(dataBlockSelector([roomId, dataBlockId]));
  const typeCheckedDataBlock = useMemo(
    () => (!!dataBlock && typeChecker(dataBlock) ? dataBlock : undefined),
    [dataBlock, typeChecker],
  );

  return typeCheckedDataBlock;
};

export const useSetDataBlock = <T extends DataBlock>(
  dataBlockId: DataBlockId,
  typeChecker: (data: DataBlock) => data is T,
) => {
  const roomId = useRoomIdValue();

  const { set: setDataBlock } = useDataBlockTable();
  const dataBlockIdRef = useRefWrap(dataBlockId);
  const typeCheckerRef = useRefWrap(typeChecker);

  const set = useRecoilCallback(
    ({ snapshot }) =>
      async (updateCallback: (dataBlock: T) => Promise<T>) => {
        const dataBlockId = dataBlockIdRef.current;
        const typeChecker = typeCheckerRef.current;

        const data = await snapshot.getPromise(dataBlockSelector([roomId, dataBlockId]));
        if (!!data && typeChecker(data)) {
          const dataBlock = await updateCallback(data);
          await setDataBlock(dataBlock);
        }
      },
    [roomId, setDataBlock, dataBlockIdRef, typeCheckerRef],
  );

  return set;
};

export const useDataBlockState = <T extends DataBlock>(
  dataBlockId: DataBlockId,
  typeChecker: (data: DataBlock) => data is T,
) => {
  const dataBlock = useDataBlockValue(dataBlockId, typeChecker);
  const set = useSetDataBlock(dataBlockId, typeChecker);

  return { dataBlock, set };
};

export const useDataBlockList = <T extends DataBlock>(
  idList: DataBlockId[],
  typeChecker: (data: DataBlock) => data is T,
) => {
  const roomId = useRoomIdValue();

  const dataBlockList = useRecoilValue(dataBlockListSelector([roomId, idList]));

  const typeCheckedDataBlockList = useMemo(() => {
    return dataBlockList.filter((dataBlock) => typeChecker(dataBlock));
  }, [dataBlockList, typeChecker]);

  return useMemo(
    () => ({
      dataBlockList: typeCheckedDataBlockList,
    }),
    [typeCheckedDataBlockList],
  );
};
