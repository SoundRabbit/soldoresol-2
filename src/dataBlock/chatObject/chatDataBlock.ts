import * as t from 'io-ts';
import { Assign } from 'utility-types';
import { v4 as uuidv4 } from 'uuid';

import { DataBlock, DataBlockId, PackedDataBlock } from '@/dataBlock';

export const dataBlockType = 'Chat';

export type ChatDataBlock = Assign<
  DataBlock,
  { dataBlockType: typeof dataBlockType; messageList: DataBlockId; channelList: DataBlockId[] }
>;

export const PackedChatDataBlock = t.intersection([
  PackedDataBlock,
  t.type({
    dataBlockType: t.literal(dataBlockType),
    messageList: t.string,
    channelList: t.array(t.string),
  }),
]);

export type PackedChatDataBlock = t.TypeOf<typeof PackedChatDataBlock>;

export const ChatDataBlock = {
  dataBlockType,

  partialIs(data: any): data is ChatDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props: { messageList: DataBlockId }, options?: Partial<ChatDataBlock>): ChatDataBlock {
    const id = options?.id ?? uuidv4();
    const messageList = options?.messageList ?? props.messageList;
    const channelList = options?.channelList ?? [];

    return {
      id,
      dataBlockType: dataBlockType,
      messageList,
      channelList,
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
      if (!PackedChatDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
        messageList: data.messageList,
        channelList: data.channelList,
      };
    })();
  },
};
