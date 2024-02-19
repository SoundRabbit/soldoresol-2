import * as t from 'io-ts';
import { v4 as uuidv4 } from 'uuid';
import { DataBlock, packedDataBlock } from '@/dataBlock';

export const dataBlockType = 'Image';

export interface ImageDataBlock extends DataBlock {
  dataBlockType: typeof dataBlockType;
  pack(self: ImageDataBlock): Promise<PackedImageDataBlock>;
  unpack(data: any): Promise<ImageDataBlock | undefined>;
}

export const packedImageDataBlock = t.intersection([
  packedDataBlock,
  t.type({
    dataBlockType: t.literal(dataBlockType),
  }),
]);

export type PackedImageDataBlock = t.TypeOf<typeof packedImageDataBlock>;

export const imageDataBlock = {
  is(data: any): data is ImageDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  new(props: Partial<ImageDataBlock>): ImageDataBlock {
    const id = props.id ?? uuidv4();
    return {
      id,
      dataBlockType: dataBlockType,
      pack: (self: ImageDataBlock) => imageDataBlock.pack(self),
      unpack: (data: object) => imageDataBlock.unpack(data),
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
      if (!packedImageDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
        pack: (self: ImageDataBlock) => imageDataBlock.pack(self),
        unpack: (data: object) => imageDataBlock.unpack(data),
      };
    })();
  },
};
