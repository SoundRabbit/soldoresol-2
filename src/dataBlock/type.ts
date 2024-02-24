import { DataBlock, DataBlockId } from './dataBlock';

export type DiffOf<T> =
  T extends object ? { [K in keyof T]: DiffOf<T[K]> }
  : ({ type: 'ref' } | { type: 'remove' } | { type: 'replace'; value: T }) & { defaultValue: T };

export type RefOf<T extends DataBlock> = Pick<T, keyof DataBlock> &
  DiffOf<Omit<T, keyof DataBlock>> & { ref?: DataBlockId };
