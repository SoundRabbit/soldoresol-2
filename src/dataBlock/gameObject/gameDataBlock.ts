import * as t from 'io-ts';
import { Assign } from 'utility-types';
import { v4 as uuidv4 } from 'uuid';

import { DataBlock, PackedDataBlock } from '@/dataBlock';

export const dataBlockType = 'Game';

export type GameDataBlock = Assign<DataBlock, { dataBlockType: typeof dataBlockType; sceneList: string[] }>;

export const PackedGameDataBlock = t.intersection([
  PackedDataBlock,
  t.type({ dataBlockType: t.literal(dataBlockType), sceneList: t.array(t.string) }),
]);

export type PackedGameDataBlock = t.TypeOf<typeof PackedGameDataBlock>;

export const GameDataBlock = {
  dataBlockType,

  partialIs(data: any): data is GameDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props?: Partial<GameDataBlock>): GameDataBlock {
    const id = props?.id ?? uuidv4();
    const sceneList = props?.sceneList ?? [];
    return {
      id,
      dataBlockType: dataBlockType,
      sceneList,
    };
  },

  pack(self: GameDataBlock): Promise<PackedGameDataBlock> {
    return (async () => {
      return {
        id: self.id,
        dataBlockType: self.dataBlockType,
        sceneList: [...self.sceneList],
      };
    })();
  },

  unpack(data: any): Promise<GameDataBlock | undefined> {
    return (async () => {
      if (!PackedGameDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
        sceneList: data.sceneList,
      };
    })();
  },
};
