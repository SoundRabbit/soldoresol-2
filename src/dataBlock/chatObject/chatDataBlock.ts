import * as t from 'io-ts';
import { v4 as uuidv4 } from 'uuid';
import { DataBlock, DataBlockId, packedDataBlock } from '@/dataBlock';

export interface ChatDataBlock extends DataBlock {
  messageList: DataBlockId;
  channelList: DataBlockId[];
  pack(self: ChatDataBlock): Promise<PackedChatDataBlock>;
  unpack(data: any): Promise<ChatDataBlock | undefined>;
}

export const packedChatDataBlock = t.intersection([
  packedDataBlock,
  t.type({
    messageList: t.string,
    channelList: t.array(t.string),
  }),
]);

export type PackedChatDataBlock = t.TypeOf<typeof packedChatDataBlock>;

export const dataBlockType = 'Chat';

export const chatDataBlock = {
  is(data: any): data is ChatDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  new(props: Partial<ChatDataBlock>): ChatDataBlock {
    const id = props.id ?? uuidv4();
    const messageList = props.messageList ?? '';
    const channelList = props.channelList ?? [];

    return {
      id,
      dataBlockType: dataBlockType,
      messageList,
      channelList,
      pack: (self: ChatDataBlock) => chatDataBlock.pack(self),
      unpack: (data: object) => chatDataBlock.unpack(data),
    };
  },

  pack(self: ChatDataBlock): Promise<PackedChatDataBlock> {
    return (async () => {
      return {
        id: self.id,
        dataBlockType: self.dataBlockType,
        messageList: self.messageList,
        channelList: [...self.channelList],
      };
    })();
  },

  unpack(data: any): Promise<ChatDataBlock | undefined> {
    return (async () => {
      if (!packedChatDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
        messageList: data.messageList,
        channelList: data.channelList,
        pack: (self: ChatDataBlock) => chatDataBlock.pack(self),
        unpack: (data: object) => chatDataBlock.unpack(data),
      };
    })();
  },
};
