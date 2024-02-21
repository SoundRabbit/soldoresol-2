import * as t from 'io-ts';
import { Assign, Subtract } from 'utility-types';

import { DataBlockId } from './dataBlockId';
import { DataBlockType } from './dataBlockType';

export { DataBlockId } from './dataBlockId';
export { DataBlockType } from './dataBlockType';

export type DataBlock = {
  id: DataBlockId;
  dataBlockType: DataBlockType;
};

const tDataBlock = t.type({
  id: t.string,
  dataBlockType: t.string,
});

export const DataBlock = {
  is(value: unknown): value is DataBlock {
    return tDataBlock.is(value);
  },
};

export const PackedDataBlock = t.type({
  id: t.readonly(t.string),
  dataBlockType: t.readonly(t.string),
});

export type PackedDataBlock = t.TypeOf<typeof PackedDataBlock>;

export type DiffOf<T> =
  T extends object ? { [K in keyof T]: DiffOf<T[K]> }
  : ({ type: 'ref' } | { type: 'remove' } | { type: 'replace'; value: T }) & { defaultValue: T };

export type RefOf<T extends DataBlock> = Assign<DataBlock, { prefab?: DataBlockId }, DiffOf<Subtract<T, DataBlock>>>;
