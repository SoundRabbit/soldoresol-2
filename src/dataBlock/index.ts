import * as t from 'io-ts';

export type DataBlockId = string;

export type DataBlockType = string;

export interface DataBlock {
  readonly id: DataBlockId;
  readonly dataBlockType: DataBlockType;
  pack(self: DataBlock): Promise<PackedDataBlock>;
  unpack(data: any): Promise<DataBlock | undefined>;
}

export const packedDataBlock = t.type({
  id: t.readonly(t.string),
  dataBlockType: t.readonly(t.string),
});

export type PackedDataBlock = t.TypeOf<typeof packedDataBlock>;
