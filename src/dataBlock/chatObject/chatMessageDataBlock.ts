import * as t from 'io-ts';
import { v4 as uuidv4 } from 'uuid';

import { DataBlock, DataBlockId, PackedDataBlock } from '@/dataBlock';

export const dataBlockType = 'ChatMessage';

export interface ChatMessageDataBlock extends DataBlock {
  dataBlockType: typeof dataBlockType;
  filterChannelList: DataBlockId[];
  originalMessage: string;
  timestamp: number;
  pack(self: this): Promise<PackedChatMessageDataBlock>;
}

export const PackedChatMessageDataBlock = t.intersection([
  PackedDataBlock,
  t.type({
    dataBlockType: t.literal(dataBlockType),
    filterChannelList: t.array(t.string),
    originalMessage: t.string,
    timestamp: t.number,
  }),
]);

export type PackedChatMessageDataBlock = t.TypeOf<typeof PackedChatMessageDataBlock>;

export const ChatMessageDataBlock = {
  dataBlockType,

  is(data: any): data is ChatMessageDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props?: Partial<ChatMessageDataBlock>): ChatMessageDataBlock {
    const id = props?.id ?? uuidv4();
    const filterChannelList = props?.filterChannelList ?? [];
    const originalMessage = props?.originalMessage ?? '';
    const timestamp = props?.timestamp ?? Date.now();
    return {
      id,
      dataBlockType: dataBlockType,
      filterChannelList,
      originalMessage,
      timestamp,
      pack: ChatMessageDataBlock.pack,
      unpack: ChatMessageDataBlock.unpack,
    };
  },

  pack(self: ChatMessageDataBlock): Promise<PackedChatMessageDataBlock> {
    return (async () => {
      return {
        id: self.id,
        dataBlockType: self.dataBlockType,
        filterChannelList: [...self.filterChannelList],
        originalMessage: self.originalMessage,
        timestamp: self.timestamp,
      };
    })();
  },

  unpack(data: any): Promise<ChatMessageDataBlock | undefined> {
    return (async () => {
      if (!PackedChatMessageDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
        filterChannelList: data.filterChannelList,
        originalMessage: data.originalMessage,
        timestamp: data.timestamp,
        pack: ChatMessageDataBlock.pack,
        unpack: ChatMessageDataBlock.unpack,
      };
    })();
  },
};
