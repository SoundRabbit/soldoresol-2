import * as t from 'io-ts';

const $DataBlockId = t.string;

export type DataBlockId = t.TypeOf<typeof $DataBlockId>;

export const DataBlockId = Object.assign(t.string, {
  none: '' as DataBlockId,
});

const $DataBlockType = t.string;

export type DataBlockType = t.TypeOf<typeof $DataBlockType>;

export const DataBlockType = Object.assign($DataBlockType, {});

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
