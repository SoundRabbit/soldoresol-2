import * as t from 'io-ts';
import { Assign } from 'utility-types';

import { DataBlock, DataBlockId, PackedDataBlock } from '@/lib/dataBlock';

export const dataBlockType = 'Image';

export type ImageDataBlock = Assign<DataBlock, { dataBlockType: typeof dataBlockType }>;

export const PackedImageDataBlock = t.intersection([
  PackedDataBlock,
  t.type({
    dataBlockType: t.literal(dataBlockType),
  }),
]);

export type PackedImageDataBlock = t.TypeOf<typeof PackedImageDataBlock>;

export const ImageDataBlock = {
  dataBlockType,

  partialIs(data: any): data is ImageDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props: Partial<ImageDataBlock>): ImageDataBlock {
    const id = props.id ?? DataBlockId.create();
    return {
      id,
      dataBlockType: dataBlockType,
    };
  },

  pack(self: ImageDataBlock): Promise<PackedImageDataBlock> {
    return (async () => {
      return {
        id: self.id,
        dataBlockType: self.dataBlockType,
      };
    })();
  },

  unpack(data: any): Promise<ImageDataBlock | undefined> {
    return (async () => {
      if (!PackedImageDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
      };
    })();
  },
};
