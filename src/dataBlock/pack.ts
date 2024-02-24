import { DataBlock, PackedDataBlock } from '@/dataBlock';

import { ChatChannelDataBlock } from './chatObject/chatChannelDataBlock';
import { ChatDataBlock } from './chatObject/chatDataBlock';
import { ChatMessageDataBlock } from './chatObject/chatMessageDataBlock';
import { ChatMessageListDataBlock } from './chatObject/chatMessageListDataBlock';
import { GameDataBlock } from './gameObject/gameDataBlock';
import { SceneDataBlock } from './gameObject/sceneDataBlock';
import { ImageDataBlock } from './resourceObject/imageDataBlock';

export const pack = async (self: DataBlock): Promise<PackedDataBlock | undefined> => {
  if (ChatChannelDataBlock.partialIs(self)) return await ChatChannelDataBlock.pack(self);
  if (ChatDataBlock.partialIs(self)) return await ChatDataBlock.pack(self);
  if (ChatMessageDataBlock.partialIs(self)) return await ChatMessageDataBlock.pack(self);
  if (ChatMessageListDataBlock.partialIs(self)) return await ChatMessageListDataBlock.pack(self);
  if (GameDataBlock.partialIs(self)) return await GameDataBlock.pack(self);
  if (SceneDataBlock.partialIs(self)) return await SceneDataBlock.pack(self);
  if (ImageDataBlock.partialIs(self)) return await ImageDataBlock.pack(self);
  return undefined;
};
