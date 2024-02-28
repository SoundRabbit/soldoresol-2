'use client';

import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRInfinite, { unstable_serialize } from 'swr/infinite';

import { DataBlockTableContext } from '@/component/context/DataBlockTableContext';
import { RoomContext } from '@/component/context/RoomContext';

import { DataBlock, DataBlockId } from '@/lib/dataBlock';
import { DataBlockTableChannel } from '@/lib/dataBlockTable';

const dataBlockSwrKey = (roomId: string, dataBlockId: DataBlockId) => [roomId, dataBlockId];

export const useDataBlockTable = () => {
  const tableContext = useContext(DataBlockTableContext);
  const roomContext = useContext(RoomContext);

  const { mutate } = useSWRConfig();

  const mutateKey = useCallback(
    (dataBlockId: DataBlockId) => {
      if (!tableContext || !roomContext) return;
      const roomId = roomContext.roomId;

      mutate(dataBlockSwrKey(roomId, dataBlockId));

      for (const getKey of tableContext.mutData.current.getKeyList) {
        mutate(unstable_serialize(getKey));
      }
    },
    [tableContext, roomContext, mutate],
  );

  const get = useCallback(
    async <T extends DataBlock>(dataBlockId: DataBlockId, typeChecker: (data: DataBlock) => data is T) => {
      if (!tableContext || !roomContext) return;
      const context = tableContext.channel;
      const roomId = roomContext.roomId;

      return await DataBlockTableChannel.get(context, roomId, dataBlockId, typeChecker);
    },
    [tableContext, roomContext],
  );

  const set = useCallback(
    async (dataBlock: DataBlock) => {
      if (!tableContext || !roomContext) return;
      const context = tableContext.channel;
      const roomId = roomContext.roomId;

      await DataBlockTableChannel.set(context, roomId, dataBlock.id, dataBlock);
      mutateKey(dataBlock.id);

      return dataBlock.id;
    },
    [tableContext, roomContext, mutateKey],
  );

  const remove = useCallback(
    async (dataBlockId: DataBlockId) => {
      if (!tableContext || !roomContext) return;
      const context = tableContext.channel;
      const roomId = roomContext.roomId;

      await DataBlockTableChannel.remove(context, roomId, dataBlockId);

      mutateKey(dataBlockId);

      return dataBlockId;
    },
    [tableContext, roomContext, mutateKey],
  );

  return useMemo(
    () => ({
      get,
      set,
      remove,
    }),
    [get, set, remove],
  );
};

export const useDataBlock = <T extends DataBlock>(
  dataBlockId: DataBlockId,
  typeChecker: (data: DataBlock) => data is T,
) => {
  const tableContext = useContext(DataBlockTableContext);
  const roomContext = useContext(RoomContext);

  const dataBlockFetcher = useCallback(async () => {
    if (!tableContext || !roomContext) return;
    const context = tableContext.channel;
    const roomId = roomContext.roomId;

    return await DataBlockTableChannel.get(context, roomId, dataBlockId, typeChecker);
  }, [tableContext, roomContext, dataBlockId, typeChecker]);

  const { set } = useDataBlockTable();
  const { data } = useSWR(dataBlockSwrKey(roomContext?.roomId ?? '', dataBlockId), dataBlockFetcher);
  const dataRef = useRef(data);
  dataRef.current = data;

  const bindedSet = useCallback(
    async (updateCallback: (dataBlock: T) => Promise<T>) => {
      const data = dataRef.current;
      if (data && typeChecker(data)) {
        const dataBlock = await updateCallback(dataRef.current as T);
        await set(dataBlock);
      }
    },
    [set, typeChecker],
  );

  return useMemo(
    () => ({
      dataBlock: !!data && typeChecker(data) ? data : undefined,
      set: bindedSet,
    }),
    [data, bindedSet, typeChecker],
  );
};

export const useDataBlockList = <T extends DataBlock>(
  idList: DataBlockId[],
  typeChecker: (data: DataBlock) => data is T,
) => {
  const tableContext = useContext(DataBlockTableContext);
  const roomContext = useContext(RoomContext);

  const getKey = useCallback(
    (index: number) => {
      const dataBlockId = idList.at(index) ?? DataBlockId.none;
      return dataBlockSwrKey(roomContext?.roomId ?? '', dataBlockId);
    },
    [idList, roomContext],
  );

  if (tableContext && tableContext.mutData.current.getKeyList.findIndex((item) => item === getKey) === -1) {
    tableContext.mutData.current.getKeyList.push(getKey);
  }

  const dataBlockFetcher = useCallback(
    async ([_, dataBlockId]: [string, string]) => {
      if (!tableContext || !roomContext) return;
      const context = tableContext.channel;
      const roomId = roomContext.roomId;

      return await DataBlockTableChannel.get(context, roomId, dataBlockId, typeChecker);
    },
    [tableContext, roomContext, typeChecker],
  );

  const { data, setSize } = useSWRInfinite(getKey, dataBlockFetcher, {
    initialSize: 0,
    persistSize: true,
    revalidateFirstPage: false,
    revalidateAll: false,
  });

  const filteredData = useMemo(() => {
    return (data?.filter((data) => !!data && typeChecker(data)) ?? []) as T[];
  }, [data, typeChecker]);

  const idListLength = useMemo(() => idList.length, [idList]);

  const cleanupGetKeyList = useCallback(() => {
    if (tableContext) {
      tableContext.mutData.current.getKeyList = tableContext.mutData.current.getKeyList.filter(
        (item) => item !== getKey,
      );
    }
  }, [tableContext, getKey]);

  useEffect(() => {
    return cleanupGetKeyList;
  }, [cleanupGetKeyList]);

  useEffect(() => {
    setSize(idListLength);
  }, [idListLength, setSize]);

  return useMemo(
    () => ({
      dataBlockList: filteredData,
    }),
    [filteredData],
  );
};
