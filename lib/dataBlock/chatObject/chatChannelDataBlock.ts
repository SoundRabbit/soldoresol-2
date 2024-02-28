import * as t from 'io-ts';
import { Assign } from 'utility-types';

import { DataBlock, DataBlockId, PackedDataBlock } from '@/lib/dataBlock';

export const dataBlockType = 'ChatChannel';

export type ChatChannelDataBlock = Assign<
  DataBlock,
  { dataBlockType: typeof dataBlockType; name: string; description: string }
>;

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

  partialIs(data: any): data is ChatChannelDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props?: Partial<ChatChannelDataBlock>): ChatChannelDataBlock {
    const id = props?.id ?? DataBlockId.create();
    const name = props?.name ?? '';
    const description = props?.description ?? '';
    return {
      id,
      dataBlockType,
      name,
      description,
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
      };
    })();
  },
};
