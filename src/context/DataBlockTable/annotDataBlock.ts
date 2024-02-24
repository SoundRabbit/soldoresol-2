import * as t from 'io-ts';

import { DataBlock, PackedDataBlock, pack as packDataBlock } from '@/dataBlock';
import { ChatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { ChatMessageDataBlock } from '@/dataBlock/chatObject/chatMessageDataBlock';
import { ChatMessageListDataBlock } from '@/dataBlock/chatObject/chatMessageListDataBlock';
import { GameDataBlock } from '@/dataBlock/gameObject/gameDataBlock';
import { SceneDataBlock } from '@/dataBlock/gameObject/sceneDataBlock';
import { ImageDataBlock } from '@/dataBlock/resourceObject/imageDataBlock';

export type AnnotDataBlock = {
  payload: DataBlock;
  updateTimestamp: number;
  isAvailable: boolean;
};

export const PackedAnnotDataBlock = t.type({
  payload: PackedDataBlock,
  updateTimestamp: t.number,
  isAvailable: t.boolean,
});

export type PackedAnnotDataBlock = t.TypeOf<typeof PackedAnnotDataBlock>;

export const AnnotDataBlock = {
  from(payload: DataBlock, updateTimestamp: number, isAvailable: boolean): AnnotDataBlock {
    return {
      payload,
      updateTimestamp,
      isAvailable,
    };
  },

  async pack(self: AnnotDataBlock): Promise<PackedAnnotDataBlock | undefined> {
    const payload = await packDataBlock(self.payload);
    if (!payload) return undefined;

    return {
      payload,
      updateTimestamp: self.updateTimestamp,
      isAvailable: self.isAvailable,
    };
  },

  async unpack(data: any): Promise<AnnotDataBlock | undefined> {
    if (!PackedAnnotDataBlock.is(data)) return undefined;

    const payload = await (async () => {
      switch (data.payload.dataBlockType) {
        case ChatChannelDataBlock.dataBlockType:
          return ChatChannelDataBlock.unpack(data.payload);
        case ChatDataBlock.dataBlockType:
          return ChatDataBlock.unpack(data.payload);
        case ChatMessageDataBlock.dataBlockType:
          return ChatMessageDataBlock.unpack(data.payload);
        case ChatMessageListDataBlock.dataBlockType:
          return ChatMessageListDataBlock.unpack(data.payload);
        case GameDataBlock.dataBlockType:
          return GameDataBlock.unpack(data.payload);
        case SceneDataBlock.dataBlockType:
          return SceneDataBlock.unpack(data.payload);
        case ImageDataBlock.dataBlockType:
          return ImageDataBlock.unpack(data.payload);
        default:
          return undefined;
      }
    })();

    if (payload === undefined) return undefined;

    return {
      payload: payload as DataBlock,
      updateTimestamp: data.updateTimestamp,
      isAvailable: data.isAvailable,
    };
  },
};
