import * as t from 'io-ts';
import { v4 as uuidv4 } from 'uuid';
import { DataBlock, DataBlockId, PackedDataBlock } from '@/dataBlock';

export const dataBlockType = 'ChatMessageList';

export interface ChatMessageListDataBlock extends DataBlock {
  dataBlockType: typeof dataBlockType;
  messageList: DataBlockId[];
  pack(self: this): Promise<PackedChatMessageListDataBlock>;
}

export const PackedChatMessageListDataBlock = t.intersection([
  PackedDataBlock,
  t.type({
    dataBlockType: t.literal(dataBlockType),
    messageList: t.array(t.string),
  }),
]);

export type PackedChatMessageListDataBlock = t.TypeOf<typeof PackedChatMessageListDataBlock>;

export const ChatMessageListDataBlock = {
  dataBlockType,

  is(data: any): data is ChatMessageListDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props: Partial<ChatMessageListDataBlock>): ChatMessageListDataBlock {
    const id = props.id ?? uuidv4();
    const messageList = props.messageList ?? [];

    return {
      id,
      dataBlockType: dataBlockType,
      messageList,
      pack: ChatMessageListDataBlock.pack,
      unpack: ChatMessageListDataBlock.unpack,
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
      if (!PackedChatMessageListDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
        messageList: data.messageList,
        pack: ChatMessageListDataBlock.pack,
        unpack: ChatMessageListDataBlock.unpack,
      };
    })();
  },
};
