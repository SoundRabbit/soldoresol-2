import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';
import { DataBlock, DataBlockId } from '@/dataBlock';

export interface AnnotDataBlock extends DataBlock {
  updateTimestamp: number;
  isAvailable: boolean;
}

export type DataBlockTable = {
  [id: DataBlockId]: AnnotDataBlock | undefined;
};

export const useDataBlockTable = () => {
  const swrKey = 'local/dataBlock/table';

  const { data: maybeDataBlockTable, mutate } = useSWR<DataBlockTable>(swrKey, null);

  const dataBlockTable = useMemo(() => {
    if (maybeDataBlockTable) {
      return maybeDataBlockTable;
    } else {
      return {};
    }
  }, [maybeDataBlockTable]);

  const add = useCallback(
    (dataBlock: DataBlock) => {
      mutate(
        (dataBlockTable) => {
          if (!dataBlockTable) return {};
          const updateTimestamp = Date.now();
          const annotDataBlock = (() => {
            const insertPosition = dataBlockTable[dataBlock.id];
            if (!!insertPosition && insertPosition.isAvailable && insertPosition.updateTimestamp > updateTimestamp) {
              const newId = uuidv4();
              return { ...dataBlock, id: newId, updateTimestamp, isAvailable: true };
            } else {
              return { ...dataBlock, updateTimestamp, isAvailable: true };
            }
          })();
          return { ...dataBlockTable, [dataBlock.id]: annotDataBlock };
        },
        { revalidate: false },
      );
    },
    [mutate],
  );

  const remove = useCallback(
    (id: DataBlockId) => {
      mutate(
        (dataBlockTable) => {
          if (!dataBlockTable) return {};

          const annotDataBlock = dataBlockTable[id];
          const updateTimestamp = Date.now();

          if (annotDataBlock === undefined || annotDataBlock!.updateTimestamp > updateTimestamp) return;

          annotDataBlock.isAvailable = false;
          annotDataBlock.updateTimestamp = updateTimestamp;

          return { ...dataBlockTable, [id]: { ...annotDataBlock } };
        },
        { revalidate: false },
      );
    },
    [mutate],
  );

  const update = useCallback(
    async (id: DataBlockId, updateCallback: (dataBlock: DataBlock) => Promise<DataBlock>) => {
      mutate(
        async (dataBlockTable) => {
          if (!dataBlockTable) return {};

          const annotDataBlock = dataBlockTable[id];
          const updateTimestamp = Date.now();

          if (annotDataBlock === undefined || annotDataBlock!.updateTimestamp > updateTimestamp) return;

          const isAvailable = annotDataBlock.isAvailable;
          const newDataBlock = await updateCallback(annotDataBlock);
          const newAnnotDataBlock = { ...newDataBlock, updateTimestamp, isAvailable };

          return { ...dataBlockTable, [id]: newAnnotDataBlock };
        },
        { revalidate: false },
      );
    },
    [mutate],
  );

  const returnValue = useMemo(
    () => ({
      dataBlockTable,
      add,
      remove,
      update,
    }),
    [dataBlockTable, add, remove, update],
  );

  return returnValue;
};

export const useDataBlock = <T extends DataBlock>(
  id: DataBlockId | undefined,
  typeChecker: (data: DataBlock) => data is T,
) => {
  const { dataBlockTable, update } = useDataBlockTable();

  const dataBlock = useMemo(() => (id ? dataBlockTable[id] : undefined), [dataBlockTable, id]);
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

  const returnValue = useMemo(
    () => ({
      dataBlock: !!dataBlock && typeChecker(dataBlock) ? (dataBlock as T) : undefined,
      update: bindedUpdate,
    }),
    [dataBlock, bindedUpdate, typeChecker],
  );

  return returnValue;
};
