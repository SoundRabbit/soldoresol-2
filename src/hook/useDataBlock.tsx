import { useCallback, useContext, useEffect, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { v4 as uuidv4 } from 'uuid';
import { DataBlockTableContext } from '@/context/DataBlockTable';
import { AnnotDataBlock } from '@/context/DataBlockTable/annotDataBlock';
import { DataBlock, DataBlockId } from '@/dataBlock';

const SWR_KEY = 'local/dataBlock';

const dataBlockSwrKey = (id: DataBlockId) => [SWR_KEY, id];

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
      const insertPosition = dataBlockTableRef.current[dataBlock.id];
      const dataBlockId =
        !!insertPosition && insertPosition.isAvailable && insertPosition.updateTimestamp > updateTimestamp
          ? uuidv4()
          : dataBlock.id;
      const annotDataBlock = AnnotDataBlock.from(dataBlock, updateTimestamp, true);

      dataBlockTableRef.current[dataBlockId] = annotDataBlock;

      mutate(dataBlockSwrKey(dataBlockId));

      return dataBlockId;
    },
    [dataBlockTableRef, mutate],
  );

  const remove = useCallback(
    (dataBlockId: DataBlockId) => {
      if (!dataBlockTableRef) return;

      const annotDataBlock = dataBlockTableRef.current[dataBlockId];
      const updateTimestamp = Date.now();

      if (annotDataBlock === undefined || annotDataBlock!.updateTimestamp > updateTimestamp) return;

      const newAnnotDataBlock = { ...annotDataBlock, isAvailable: false, updateTimestamp };

      dataBlockTableRef.current[dataBlockId] = newAnnotDataBlock;
      mutate(dataBlockSwrKey(dataBlockId));

      return dataBlockId;
    },
    [dataBlockTableRef, mutate],
  );

  const update = useCallback(
    async (dataBlockId: DataBlockId, updateCallback: (dataBlock: DataBlock) => Promise<DataBlock>) => {
      if (!dataBlockTableRef) return;

      const annotDataBlock = dataBlockTableRef.current[dataBlockId];
      const updateTimestamp = Date.now();

      if (annotDataBlock === undefined || annotDataBlock!.updateTimestamp > updateTimestamp) return;

      const isAvailable = annotDataBlock.isAvailable;
      const newPyaload = await updateCallback(annotDataBlock.payload);
      const newAnnotDataBlock = { ...annotDataBlock, payload: newPyaload, updateTimestamp, isAvailable };

      dataBlockTableRef.current[dataBlockId] = newAnnotDataBlock;
      mutate(dataBlockSwrKey(dataBlockId));

      return dataBlockId;
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
  dataBlockId: DataBlockId,
  typeChecker: (data: DataBlock) => data is T,
) => {
  const dataBlockTableRef = useContext(DataBlockTableContext);

  const dataBlockFetcher = useCallback(async () => {
    if (!dataBlockTableRef) return;

    return dataBlockTableRef.current[dataBlockId];
  }, [dataBlockTableRef, dataBlockId]);

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
      dataBlock: !!data && typeChecker(data.payload) ? data.payload : undefined,
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
      return dataBlockSwrKey(idList.at(index) ?? DataBlockId.none);
    },
    [idList],
  );

  const dataBlockFetcher = useCallback(
    async ([_, id]: (string | undefined)[]) => {
      if (!id) return;
      if (!dataBlockTableRef) return;

      return dataBlockTableRef.current[id]?.payload;
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
