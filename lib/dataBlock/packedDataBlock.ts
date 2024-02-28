import * as t from 'io-ts';

export const PackedDataBlock = t.type({
  id: t.readonly(t.string),
  dataBlockType: t.readonly(t.string),
});

export type PackedDataBlock = t.TypeOf<typeof PackedDataBlock>;
