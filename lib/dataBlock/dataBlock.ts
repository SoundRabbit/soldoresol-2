import * as t from 'io-ts';
import { v4 as uuidv4 } from 'uuid';

const $DataBlockId = t.string;

export type DataBlockId = t.TypeOf<typeof $DataBlockId>;

export const DataBlockId = Object.assign(t.string, {
  none: '' as DataBlockId,
  create(): DataBlockId {
    return uuidv4();
  },
});

const $DataBlockType = t.string;

export type DataBlockType = t.TypeOf<typeof $DataBlockType>;

export const DataBlockType = Object.assign($DataBlockType, {});

export type DataBlock = {
  id: DataBlockId;
  dataBlockType: DataBlockType;
};

const $DataBlock = t.type({
  id: t.string,
  dataBlockType: t.string,
});

export const DataBlock = {
  is(value: unknown): value is DataBlock {
    return $DataBlock.is(value);
  },

  none(): DataBlock {
    return {
      id: DataBlockId.none,
      dataBlockType: 'none',
    };
  },
};
