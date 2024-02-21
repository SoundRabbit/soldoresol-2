import * as t from 'io-ts';
import { v4 as uuidv4 } from 'uuid';

import { DataBlock, PackedDataBlock } from '@/dataBlock';

export const dataBlockType = 'ChatChannel';

export interface ChatChannelDataBlock extends DataBlock {
  dataBlockType: typeof dataBlockType;
  name: string;
  description: string;
  pack(self: this): Promise<PackedChatChannelDataBlock>;
}

export const PackedChatChannelDataBlock = t.intersection([
  PackedDataBlock,
  t.type({
    dataBlockType: t.literal(dataBlockType),
    description: t.string,
    name: t.string,
  }),
]);

export type PackedChatChannelDataBlock = t.TypeOf<typeof PackedChatChannelDataBlock>;

export const ChatChannelDataBlock = {
  dataBlockType,

  is(data: any): data is ChatChannelDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props?: Partial<ChatChannelDataBlock>): ChatChannelDataBlock {
    const id = props?.id ?? uuidv4();
    const name = props?.name ?? '';
    const description = props?.description ?? '';
    return {
      id,
      dataBlockType,
      name,
      description,
      pack: ChatChannelDataBlock.pack,
      unpack: ChatChannelDataBlock.unpack,
    };
  },

  pack(self: ChatChannelDataBlock): Promise<PackedChatChannelDataBlock> {
    return (async () => ({
      id: self.id,
      dataBlockType,
      name: self.name,
      description: self.description,
    }))();
  },

  unpack(data: any): Promise<ChatChannelDataBlock | undefined> {
    return (async () => {
      if (!PackedChatChannelDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
        name: data.name,
        description: data.description,
        pack: ChatChannelDataBlock.pack,
        unpack: ChatChannelDataBlock.unpack,
      };
    })();
  },
};
