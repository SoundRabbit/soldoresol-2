import { DataBlock } from '@/libs/dataBlock';

export type AnnotDataBlock = {
  payload: DataBlock;
  updateTimestamp: number;
  isAvailable: boolean;
};

export const AnnotDataBlock = {
  from(payload: DataBlock, updateTimestamp: number, isAvailable: boolean): AnnotDataBlock {
    return {
      payload,
      updateTimestamp,
      isAvailable,
    };
  },
};
