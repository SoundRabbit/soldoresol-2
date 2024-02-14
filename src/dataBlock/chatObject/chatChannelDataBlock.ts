import * as t from 'io-ts';
import { v4 as uuidv4 } from 'uuid';
import { DataBlock, packedDataBlock } from '@/dataBlock';

export interface ChatChannelDataBlock extends DataBlock {
  name: string;
  pack(self: ChatChannelDataBlock): Promise<PackedChatChannelDataBlock>;
  unpack(data: any): Promise<ChatChannelDataBlock | undefined>;
}

export const packedChatChannelDataBlock = t.intersection([
  packedDataBlock,
  t.type({
    name: t.string,
  }),
]);

export type PackedChatChannelDataBlock = t.TypeOf<typeof packedChatChannelDataBlock>;

export const dataBlockType = 'ChatChannel';

export const chatChannelDataBlock = {
  is(data: any): data is ChatChannelDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  new(props: Partial<ChatChannelDataBlock>): ChatChannelDataBlock {
    const id = props.id ?? uuidv4();
    const name = props.name ?? '';
    return {
      id,
      dataBlockType,
      name,
      pack: (self: ChatChannelDataBlock) => chatChannelDataBlock.pack(self),
      unpack: (data: object) => chatChannelDataBlock.unpack(data),
    };
  },

  pack(self: ChatChannelDataBlock): Promise<PackedChatChannelDataBlock> {
    return (async () => ({
      id: self.id,
      dataBlockType,
      name: self.name,
    }))();
  },

  unpack(data: any): Promise<ChatChannelDataBlock | undefined> {
    return (async () => {
      if (!chatChannelDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
        name: data.name,
        pack: (self: ChatChannelDataBlock) => chatChannelDataBlock.pack(self),
        unpack: (data: object) => chatChannelDataBlock.unpack(data),
      };
    })();
  },
};
