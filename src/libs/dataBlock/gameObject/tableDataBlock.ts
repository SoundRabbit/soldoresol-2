import { Assign } from 'utility-types';

import { DataBlock, DataBlockId, RefOf } from '@/libs/dataBlock';

export const dataBlockType = 'Table';
export const refDataBlockType = 'RefTable';

export type TableDataBlock = Assign<
  DataBlock,
  { dataBlockType: typeof dataBlockType; name: string; workboardList: DataBlockId[] }
>;

export type RefTableDataBlock = RefOf<TableDataBlock, typeof refDataBlockType>;

export const TableDataBlock = {
  partialIs(data: unknown): data is TableDataBlock {
    return typeof data === 'object' && data !== null && (data as any).dataBlockType === dataBlockType;
  },

  create(option?: Partial<TableDataBlock>): TableDataBlock {
    const id = option?.id ?? DataBlockId.create();
    const name = option?.name ?? '';
    const workboardList = option?.workboardList ?? [];
    return {
      id,
      dataBlockType: dataBlockType,
      name,
      workboardList,
    };
  },
};

export const RefTableDataBlock = {
  partialIs(data: unknown): data is RefTableDataBlock {
    return typeof data === 'object' && data !== null && (data as any).dataBlockType === refDataBlockType;
  },
};
