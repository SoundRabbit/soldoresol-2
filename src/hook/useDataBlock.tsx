import { useCallback, useContext, useEffect, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRInfinite, { unstable_serialize } from 'swr/infinite';
import { v4 as uuidv4 } from 'uuid';
import { DataBlockTableContext } from '@/context/DataBlockTable';
import { AnnotDataBlock } from '@/context/DataBlockTable/annotDataBlock';
import { DataBlock, DataBlockId } from '@/dataBlock';

const SWR_KEY = 'local/dataBlock';

const dataBlockSwrKey = (id: DataBlockId) => [SWR_KEY, id];

export const useDataBlockTable = () => {
  const annotDataBlockTableRef = useContext(DataBlockTableContext);

  const { mutate } = useSWRConfig();

  const isExist = useCallback(
    (id?: DataBlockId) => {
      if (!annotDataBlockTableRef || !id) return false;

      return annotDataBlockTableRef.current.payload[id] !== undefined;
    },
    [annotDataBlockTableRef],
  );

  const add = useCallback(
    (dataBlock: DataBlock) => {
      if (!annotDataBlockTableRef) return;

      const updateTimestamp = Date.now();
      const insertPosition = annotDataBlockTableRef.current.payload[dataBlock.id];
      const dataBlockId =
        !!insertPosition && insertPosition.isAvailable && insertPosition.updateTimestamp > updateTimestamp
          ? uuidv4()
          : dataBlock.id;
      const annotDataBlock = AnnotDataBlock.from(dataBlock, updateTimestamp, true);

      annotDataBlockTableRef.current.payload[dataBlockId] = annotDataBlock;

      mutate(dataBlockSwrKey(dataBlockId));
      for (const getKey of annotDataBlockTableRef.current.getKeyList) {
        mutate(unstable_serialize(getKey));
      }

      return dataBlockId;
    },
    [annotDataBlockTableRef, mutate],
  );

  const remove = useCallback(
    (dataBlockId: DataBlockId) => {
      if (!annotDataBlockTableRef) return;

      const annotDataBlock = annotDataBlockTableRef.current.payload[dataBlockId];
      const updateTimestamp = Date.now();

      if (annotDataBlock === undefined || annotDataBlock!.updateTimestamp > updateTimestamp) return;

      const newAnnotDataBlock = { ...annotDataBlock, isAvailable: false, updateTimestamp };

      annotDataBlockTableRef.current.payload[dataBlockId] = newAnnotDataBlock;

      mutate(dataBlockSwrKey(dataBlockId));
      for (const getKey of annotDataBlockTableRef.current.getKeyList) {
        mutate(unstable_serialize(getKey));
      }

      return dataBlockId;
    },
    [annotDataBlockTableRef, mutate],
  );

  const update = useCallback(
    async (dataBlockId: DataBlockId, updateCallback: (dataBlock: DataBlock) => Promise<DataBlock>) => {
      if (!annotDataBlockTableRef) return;

      const annotDataBlock = annotDataBlockTableRef.current.payload[dataBlockId];
      const updateTimestamp = Date.now();

      if (annotDataBlock === undefined || annotDataBlock!.updateTimestamp > updateTimestamp) return;

      const isAvailable = annotDataBlock.isAvailable;
      const newPyaload = await updateCallback(annotDataBlock.payload);
      const newAnnotDataBlock = { ...annotDataBlock, payload: newPyaload, updateTimestamp, isAvailable };

      annotDataBlockTableRef.current.payload[dataBlockId] = newAnnotDataBlock;

      mutate(dataBlockSwrKey(dataBlockId));
      for (const getKey of annotDataBlockTableRef.current.getKeyList) {
        mutate(unstable_serialize(getKey));
      }

      return dataBlockId;
    },
    [annotDataBlockTableRef, mutate],
  );

  return useMemo(
    () => ({
      isExist,
      add,
      remove,
      update,
    }),
    [isExist, add, remove, update],
  );
};

export const useDataBlock = <T extends DataBlock>(
  dataBlockId: DataBlockId,
  typeChecker: (data: DataBlock) => data is T,
) => {
  const annotDataBlockTableRef = useContext(DataBlockTableContext);

  const dataBlockFetcher = useCallback(async () => {
    if (!annotDataBlockTableRef) return;

    return annotDataBlockTableRef.current.payload[dataBlockId]?.payload;
  }, [annotDataBlockTableRef, dataBlockId]);

  const { update } = useDataBlockTable();
  const { data } = useSWR(dataBlockSwrKey(dataBlockId), dataBlockFetcher);

  const bindedUpdate = useCallback(
    async (updateCallback: (dataBlock: T) => Promise<T>) => {
      await update(dataBlockId, async (dataBlock) => {
        if (typeChecker(dataBlock)) {
          return await updateCallback(dataBlock);
        } else {
          return dataBlock;
        }
      });
    },
    [dataBlockId, update, typeChecker],
  );

  return useMemo(
    () => ({
      dataBlock: !!data && typeChecker(data) ? data : undefined,
      update: bindedUpdate,
    }),
    [data, bindedUpdate, typeChecker],
  );
};

export const useDataBlockList = <T extends DataBlock>(
  idList: DataBlockId[],
  typeChecker: (data: DataBlock) => data is T,
) => {
  const annotDataBlockTableRef = useContext(DataBlockTableContext);

  const getKey = useCallback(
    (index: number) => {
      const dataBlockId = idList.at(index) ?? DataBlockId.none;
      return dataBlockSwrKey(dataBlockId);
    },
    [idList],
  );

  if (annotDataBlockTableRef && annotDataBlockTableRef.current.getKeyList.findIndex((item) => item === getKey) === -1) {
    annotDataBlockTableRef.current.getKeyList.push(getKey);
  }

  const dataBlockFetcher = useCallback(
    async ([_, dataBlockId]: [string, string]) => {
      if (!annotDataBlockTableRef) return;

      return annotDataBlockTableRef.current.payload[dataBlockId]?.payload;
    },
    [annotDataBlockTableRef],
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
