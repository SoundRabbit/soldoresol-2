import { useCallback, useContext, useEffect, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { v4 as uuidv4 } from 'uuid';
import { DataBlockTableContext } from '@/context/DataBlock';
import { DataBlock, DataBlockId } from '@/dataBlock';

const SWR_KEY = 'local/dataBlock';

const dataBlockSwrKey = (id: DataBlockId | undefined) => [SWR_KEY, id];

export const useDataBlockTable = () => {
  const dataBlockTableRef = useContext(DataBlockTableContext);

  const { mutate } = useSWRConfig();

  const isExist = useCallback(
    (id?: DataBlockId) => {
      if (!dataBlockTableRef || !id) return false;

      return dataBlockTableRef.current[id] !== undefined;
    },
    [dataBlockTableRef],
  );

  const add = useCallback(
    (dataBlock: DataBlock) => {
      if (!dataBlockTableRef) return;

      const updateTimestamp = Date.now();
      const annotDataBlock = (() => {
        const insertPosition = dataBlockTableRef.current[dataBlock.id];
        if (!!insertPosition && insertPosition.isAvailable && insertPosition.updateTimestamp > updateTimestamp) {
          const newId = uuidv4();
          return { ...dataBlock, id: newId, updateTimestamp, isAvailable: true };
        } else {
          return { ...dataBlock, updateTimestamp, isAvailable: true };
        }
      })();
      dataBlockTableRef.current[annotDataBlock.id] = annotDataBlock;

      mutate([SWR_KEY, annotDataBlock.id]);

      return annotDataBlock.id;
    },
    [dataBlockTableRef, mutate],
  );

  const remove = useCallback(
    (id: DataBlockId) => {
      if (!dataBlockTableRef) return;

      const annotDataBlock = dataBlockTableRef.current[id];
      const updateTimestamp = Date.now();

      if (annotDataBlock === undefined || annotDataBlock!.updateTimestamp > updateTimestamp) return;

      const newAnnotDataBlock = { ...annotDataBlock, isAvailable: false, updateTimestamp };

      dataBlockTableRef.current[id] = newAnnotDataBlock;
      mutate([SWR_KEY, id]);

      return newAnnotDataBlock.id;
    },
    [dataBlockTableRef, mutate],
  );

  const update = useCallback(
    async (id: DataBlockId, updateCallback: (dataBlock: DataBlock) => Promise<DataBlock>) => {
      if (!dataBlockTableRef) return;

      const annotDataBlock = dataBlockTableRef.current[id];
      const updateTimestamp = Date.now();

      if (annotDataBlock === undefined || annotDataBlock!.updateTimestamp > updateTimestamp) return;

      const isAvailable = annotDataBlock.isAvailable;
      const newDataBlock = await updateCallback(annotDataBlock);
      const newAnnotDataBlock = { ...newDataBlock, updateTimestamp, isAvailable };

      dataBlockTableRef.current[id] = newAnnotDataBlock;
      mutate([SWR_KEY, id]);

      return newAnnotDataBlock.id;
    },
    [dataBlockTableRef, mutate],
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
  id: DataBlockId | undefined,
  typeChecker: (data: DataBlock) => data is T,
) => {
  const dataBlockTableRef = useContext(DataBlockTableContext);

  const dataBlockFetcher = useCallback(async () => {
    if (!dataBlockTableRef || !id) return;

    return dataBlockTableRef.current[id];
  }, [dataBlockTableRef, id]);

  const { update } = useDataBlockTable();
  const { data } = useSWR(dataBlockSwrKey(id), dataBlockFetcher);

  const bindedUpdate = useCallback(
    async (updateCallback: (dataBlock: T) => Promise<T>) => {
      if (!id) return;

      await update(id, async (dataBlock) => {
        if (typeChecker(dataBlock)) {
          return await updateCallback(dataBlock);
        } else {
          return dataBlock;
        }
      });
    },
    [id, update, typeChecker],
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
  const dataBlockTableRef = useContext(DataBlockTableContext);

  const swrKey = useCallback(
    (index: number) => {
      return dataBlockSwrKey(idList.at(index));
    },
    [idList],
  );

  const dataBlockFetcher = useCallback(
    async ([_, id]: (string | undefined)[]) => {
      if (!id) return;
      if (!dataBlockTableRef) return;

      return dataBlockTableRef.current[id];
    },
    [dataBlockTableRef],
  );

  const { data, setSize } = useSWRInfinite(swrKey, dataBlockFetcher, {
    initialSize: idList.length,
  });

  const filteredData = useMemo(() => {
    return data?.filter((data) => !!data && typeChecker(data));
  }, [data, typeChecker]);

  useEffect(() => {
    setSize(idList.length);
  }, [idList, setSize]);

  return useMemo(
    () => ({
      dataBlockList: filteredData,
    }),
    [filteredData],
  );
};
