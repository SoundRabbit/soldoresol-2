import * as t from 'io-ts';
import { v4 as uuidv4 } from 'uuid';
import { DataBlock, DataBlockId, packedDataBlock } from '@/dataBlock';

export interface GameDataBlock extends DataBlock {
  sceneList: DataBlockId[];
  pack(self: GameDataBlock): Promise<PackedGameDataBlock>;
  unpack(data: any): Promise<GameDataBlock | undefined>;
}

const packedGameDataBlock = t.intersection([packedDataBlock, t.type({ sceneList: t.array(t.string) })]);

export type PackedGameDataBlock = t.TypeOf<typeof packedGameDataBlock>;

export const dataBlockType = 'Game';

export const gameDataBlock = {
  is(data: any): data is GameDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  new(props: Partial<GameDataBlock>): GameDataBlock {
    const id = props.id ?? uuidv4();
    const sceneList = props.sceneList ?? [];
    return {
      id,
      dataBlockType: dataBlockType,
      sceneList,
      pack: (self: GameDataBlock) => gameDataBlock.pack(self),
      unpack: (data: object) => gameDataBlock.unpack(data),
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
      if (!packedGameDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
        sceneList: data.sceneList,
        pack: (self: GameDataBlock) => gameDataBlock.pack(self),
        unpack: (data: object) => gameDataBlock.unpack(data),
      };
    })();
  },
};
