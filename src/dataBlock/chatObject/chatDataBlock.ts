import * as t from 'io-ts';
import { v4 as uuidv4 } from 'uuid';

import { DataBlock, DataBlockId, PackedDataBlock } from '@/dataBlock';

export const dataBlockType = 'Chat';

export interface ChatDataBlock extends DataBlock {
  dataBlockType: typeof dataBlockType;
  messageList: DataBlockId;
  channelList: DataBlockId[];
  pack(self: this): Promise<PackedChatDataBlock>;
}

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

  is(data: any): data is ChatDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props?: Partial<ChatDataBlock>): ChatDataBlock {
    const id = props?.id ?? uuidv4();
    const messageList = props?.messageList ?? '';
    const channelList = props?.channelList ?? [];

    return {
      id,
      dataBlockType: dataBlockType,
      messageList,
      channelList,
      pack: ChatDataBlock.pack,
      unpack: ChatDataBlock.unpack,
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
        pack: ChatDataBlock.pack,
        unpack: ChatDataBlock.unpack,
      };
    })();
  },
};
