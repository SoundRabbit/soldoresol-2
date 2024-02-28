import * as t from 'io-ts';
import { Assign } from 'utility-types';

import { DataBlock, DataBlockId, PackedDataBlock } from '@/lib/dataBlock';

export const dataBlockType = 'ChatMessage';

export type ChatMessageDataBlock = Assign<
  DataBlock,
  {
    dataBlockType: typeof dataBlockType;
    filterChannelList: DataBlockId[];
    originalMessage: string;
    timestamp: number;
  }
>;

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

  partialIs(data: any): data is ChatMessageDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props?: Partial<ChatMessageDataBlock>): ChatMessageDataBlock {
    const id = props?.id ?? DataBlockId.create();
    const filterChannelList = props?.filterChannelList ?? [];
    const originalMessage = props?.originalMessage ?? '';
    const timestamp = props?.timestamp ?? Date.now();
    return {
      id,
      dataBlockType: dataBlockType,
      filterChannelList,
      originalMessage,
      timestamp,
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
      };
    })();
  },
};
