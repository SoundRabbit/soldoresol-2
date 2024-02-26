import { DataBlock, DataBlockId } from './dataBlock';

export type DiffOf<T> = T extends object ? { [K in keyof T]: DiffOf<T[K]> } : Diff<T>;

export type Diff<T> = DiffRef<T> | DiffRemove<T> | DiffReplace<T>;

export type DiffRef<T> = { type: 'ref'; defaultValue: T };
export type DiffRemove<T> = { type: 'remove'; defaultValue: T };
export type DiffReplace<T> = { type: 'replace'; value: T };

export const Diff = {
  isRef<T>(diff: Diff<T>): diff is DiffRef<T> {
    return diff.type === 'ref';
  },

  isRemove<T>(diff: Diff<T>): diff is DiffRemove<T> {
    return diff.type === 'remove';
  },

  isReplace<T>(diff: Diff<T>): diff is DiffReplace<T> {
    return diff.type === 'replace';
  },

  ref<T>(defaultValue: T): Diff<T> {
    return { type: 'ref', defaultValue };
  },

  remove<T>(defaultValue: T): Diff<T> {
    return { type: 'remove', defaultValue };
  },

  replace<T>(value: T): Diff<T> {
    return { type: 'replace', value };
  },
};

type NonTypedDataBlock = Omit<DataBlock, 'dataBlockType'>;

export type RefOf<T extends DataBlock, D> = Pick<T, keyof NonTypedDataBlock> &
  DiffOf<Omit<T, keyof DataBlock>> & { ref: DataBlockId; dataBlockType: D };
