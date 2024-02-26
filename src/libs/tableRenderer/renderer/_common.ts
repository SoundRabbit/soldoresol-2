import { DataBlock, DataBlockId } from '@/libs/dataBlock';
import { Maybe } from '@/utils/utilityTypes';

export type GetDataBlock = <T extends DataBlock>(
  dataBlockId: DataBlockId,
  typeChecker: (data: unknown) => data is T,
) => { payload: Maybe<T>; updateTimestamp: number };
