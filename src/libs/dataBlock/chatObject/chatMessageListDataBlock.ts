import * as t from 'io-ts';
import { Assign } from 'utility-types';

import { DataBlock, DataBlockId, PackedDataBlock } from '@/libs/dataBlock';

export const dataBlockType = 'ChatMessageList';

export type ChatMessageListDataBlock = Assign<
  DataBlock,
  { dataBlockType: typeof dataBlockType; messageList: DataBlockId[] }
>;

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

  partialIs(data: any): data is ChatMessageListDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props?: Partial<ChatMessageListDataBlock>): ChatMessageListDataBlock {
    const id = props?.id ?? DataBlockId.create();
    const messageList = props?.messageList ?? [];

    return {
      id,
      dataBlockType: dataBlockType,
      messageList,
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
      };
    })();
  },
};
