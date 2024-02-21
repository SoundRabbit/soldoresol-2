import * as t from 'io-ts';
import { v4 as uuidv4 } from 'uuid';

import { DataBlock, PackedDataBlock } from '@/dataBlock';

export const dataBlockType = 'Image';

export interface ImageDataBlock extends DataBlock {
  dataBlockType: typeof dataBlockType;
}

export const PackedImageDataBlock = t.intersection([
  PackedDataBlock,
  t.type({
    dataBlockType: t.literal(dataBlockType),
  }),
]);

export type PackedImageDataBlock = t.TypeOf<typeof PackedImageDataBlock>;

export const ImageDataBlock = {
  dataBlockType,

  is(data: any): data is ImageDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props: Partial<ImageDataBlock>): ImageDataBlock {
    const id = props.id ?? uuidv4();
    return {
      id,
      dataBlockType: dataBlockType,
      pack: ImageDataBlock.pack,
      unpack: ImageDataBlock.unpack,
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
        pack: ImageDataBlock.pack,
        unpack: ImageDataBlock.unpack,
      };
    })();
  },
};
