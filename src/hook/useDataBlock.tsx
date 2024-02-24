'use client';

import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRInfinite, { unstable_serialize } from 'swr/infinite';

import { DataBlockTableContext } from '@/context/DataBlockTable';
import { RoomContext } from '@/context/RoomContext';
import { DataBlock, DataBlockId } from '@/libs/dataBlock';

const dataBlockSwrKey = (roomId: string, dataBlockId: DataBlockId) => [roomId, dataBlockId];

export const useDataBlockTable = () => {
  const annotDataBlockTableRef = useContext(DataBlockTableContext);
  const { roomId } = useContext(RoomContext);

  const { mutate } = useSWRConfig();

  const get = useCallback(
    async <T extends DataBlock>(dataBlockId: DataBlockId, typeChecker: (data: DataBlock) => data is T) => {
      if (!annotDataBlockTableRef) return;

      return await annotDataBlockTableRef.current.channel.get(roomId, dataBlockId, typeChecker);
    },
    [annotDataBlockTableRef, roomId],
  );

  const set = useCallback(
    async (dataBlock: DataBlock) => {
      if (!annotDataBlockTableRef) return;

      await annotDataBlockTableRef.current.channel.set(roomId, dataBlock.id, dataBlock);
      mutate(dataBlockSwrKey(roomId, dataBlock.id));
      for (const getKey of annotDataBlockTableRef.current.getKeyList) {
        mutate(unstable_serialize(getKey));
      }

      return dataBlock.id;
    },
    [annotDataBlockTableRef, roomId, mutate],
  );

  const remove = useCallback(
    (dataBlockId: DataBlockId) => {
      if (!annotDataBlockTableRef) return;

      annotDataBlockTableRef.current.channel.remove(roomId, dataBlockId);

      mutate(dataBlockSwrKey(roomId, dataBlockId));
      for (const getKey of annotDataBlockTableRef.current.getKeyList) {
        mutate(unstable_serialize(getKey));
      }

      return dataBlockId;
    },
    [annotDataBlockTableRef, roomId, mutate],
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
  const annotDataBlockTableRef = useContext(DataBlockTableContext);
  const { roomId } = useContext(RoomContext);

  const dataBlockFetcher = useCallback(async () => {
    if (!annotDataBlockTableRef) return;

    return await annotDataBlockTableRef.current.channel.get(roomId, dataBlockId, typeChecker);
  }, [annotDataBlockTableRef, roomId, dataBlockId, typeChecker]);

  const { set } = useDataBlockTable();
  const { data } = useSWR(dataBlockSwrKey(roomId, dataBlockId), dataBlockFetcher);
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
  const annotDataBlockTableRef = useContext(DataBlockTableContext);
  const { roomId } = useContext(RoomContext);

  const getKey = useCallback(
    (index: number) => {
      const dataBlockId = idList.at(index) ?? DataBlockId.none;
      return dataBlockSwrKey(roomId, dataBlockId);
    },
    [idList, roomId],
  );

  if (annotDataBlockTableRef && annotDataBlockTableRef.current.getKeyList.findIndex((item) => item === getKey) === -1) {
    annotDataBlockTableRef.current.getKeyList.push(getKey);
  }

  const dataBlockFetcher = useCallback(
    async ([_, dataBlockId]: [string, string]) => {
      if (!annotDataBlockTableRef) return;

      return await annotDataBlockTableRef.current.channel.get(roomId, dataBlockId, typeChecker);
    },
    [annotDataBlockTableRef, roomId, typeChecker],
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

  const creanupGetKeyList = useCallback(() => {
    if (annotDataBlockTableRef) {
      annotDataBlockTableRef.current.getKeyList = annotDataBlockTableRef.current.getKeyList.filter(
        (item) => item !== getKey,
      );
    }
  }, [annotDataBlockTableRef, getKey]);

  useEffect(() => {
    return creanupGetKeyList;
  }, [creanupGetKeyList]);

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
