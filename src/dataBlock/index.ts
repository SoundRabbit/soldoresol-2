import * as t from 'io-ts';

export type DataBlockId = string;

export const DataBlockId = {
  none: '' as DataBlockId,
};

export type DataBlockType = string;

export interface DataBlock {
  readonly id: DataBlockId;
  readonly dataBlockType: DataBlockType;
  pack(self: this): Promise<PackedDataBlock>;
  unpack(data: any): Promise<this | undefined>;
}

export const PackedDataBlock = t.type({
  id: t.readonly(t.string),
  dataBlockType: t.readonly(t.string),
});

export type PackedDataBlock = t.TypeOf<typeof PackedDataBlock>;
