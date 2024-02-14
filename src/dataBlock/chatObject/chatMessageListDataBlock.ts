import * as t from 'io-ts';
import { v4 as uuidv4 } from 'uuid';
import { DataBlock, DataBlockId, packedDataBlock } from '@/dataBlock';

export interface ChatMessageListDataBlock extends DataBlock {
  messageList: DataBlockId[];
  pack(self: ChatMessageListDataBlock): Promise<PackedChatMessageListDataBlock>;
  unpack(data: any): Promise<ChatMessageListDataBlock | undefined>;
}

export const packedChatMessageListDataBlock = t.intersection([
  packedDataBlock,
  t.type({
    messageList: t.array(t.string),
  }),
]);

export type PackedChatMessageListDataBlock = t.TypeOf<typeof packedChatMessageListDataBlock>;

export const dataBlockType = 'ChatMessageList';

export const chatMessageListDataBlock = {
  is(data: any): data is ChatMessageListDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  new(props: Partial<ChatMessageListDataBlock>): ChatMessageListDataBlock {
    const id = props.id ?? uuidv4();
    const messageList = props.messageList ?? [];

    return {
      id,
      dataBlockType: dataBlockType,
      messageList,
      pack: (self: ChatMessageListDataBlock) => chatMessageListDataBlock.pack(self),
      unpack: (data: object) => chatMessageListDataBlock.unpack(data),
    };
  },

  pack(self: ChatMessageListDataBlock): Promise<PackedChatMessageListDataBlock> {
    return (async () => {
      return {
        id: self.id,
        dataBlockType: self.dataBlockType,
        messageList: [...self.messageList],
      };
    })();
  },

  unpack(data: any): Promise<ChatMessageListDataBlock | undefined> {
    return (async () => {
      if (!packedChatMessageListDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
        messageList: data.messageList,
        pack: (self: ChatMessageListDataBlock) => chatMessageListDataBlock.pack(self),
        unpack: (data: object) => chatMessageListDataBlock.unpack(data),
      };
    })();
  },
};
