import { Assign } from 'utility-types';

import { DataBlock, DataBlockId, RefOf } from '@/lib/dataBlock';

import { Diff } from '../type';

const dataBlockType = 'Workboard';
const refDataBlockType = 'RefWorkboard';

export type WorkboardDataBlock = Assign<
  DataBlock,
  { dataBlockType: typeof dataBlockType; name: string; size: [number, number] }
>;

export type RefWorkboardDataBlock = RefOf<WorkboardDataBlock, typeof refDataBlockType>;

export const WorkboardDataBlock = {
  partialIs(data: unknown): data is WorkboardDataBlock {
    return typeof data === 'object' && data !== null && (data as any).dataBlockType === dataBlockType;
  },

  create(option?: Partial<WorkboardDataBlock>): WorkboardDataBlock {
    const id = option?.id ?? DataBlockId.create();
    const name = option?.name ?? '';
    const size = option?.size ?? [10, 10];
    return {
      id,
      dataBlockType,
      name,
      size,
    };
  },
};

export const RefWorkboardDataBlock = {
  partialIs(data: unknown): data is RefWorkboardDataBlock {
    return typeof data === 'object' && data !== null && (data as any).dataBlockType === dataBlockType;
  },

  create(props: { ref: DataBlockId }, option?: Partial<RefWorkboardDataBlock>): RefWorkboardDataBlock {
    const id = option?.id ?? DataBlockId.create();
    const dataBlockType = refDataBlockType;
    const ref = option?.ref ?? props.ref;
    const name = option?.name ?? Diff.ref('');
    const size = option?.size ?? [Diff.ref(10), Diff.ref(10)];

    return { id, dataBlockType, ref, name, size };
  },
};
