import * as t from 'io-ts';
import { DataBlock, DataBlockId, PackedDataBlock } from '@/dataBlock';

export const dataBlockType = 'Scene';

export interface SceneDataBlock extends DataBlock {
  dataBlockType: typeof dataBlockType;
  prefab?: DataBlockId;
  name: string;
  pack(self: this): Promise<PackedSceneDataBlock>;
}

export const PackedSceneDataBlock = t.intersection([
  PackedDataBlock,
  t.type({ dataBlockType: t.literal(dataBlockType), prefab: t.union([t.string, t.undefined]), name: t.string }),
]);

export type PackedSceneDataBlock = t.TypeOf<typeof PackedSceneDataBlock>;

export const SceneDataBlock = {
  dataBlockType,

  is(data: any): data is SceneDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props?: Partial<SceneDataBlock>): SceneDataBlock {
    const id = props?.id ?? '';
    const prefab = props?.prefab ?? '';
    const name = props?.name ?? '';
    return {
      id,
      dataBlockType,
      prefab,
      name,
      pack: SceneDataBlock.pack,
      unpack: SceneDataBlock.unpack,
    };
  },

  pack(self: SceneDataBlock): Promise<PackedSceneDataBlock> {
    return (async () => {
      return {
        id: self.id,
        dataBlockType: self.dataBlockType,
        prefab: self.prefab,
        name: self.name,
      };
    })();
  },

  unpack(data: any): Promise<SceneDataBlock | undefined> {
    return (async () => {
      if (!PackedSceneDataBlock.is(data)) return undefined;
      return {
        id: data.id,
        dataBlockType: data.dataBlockType,
        prefab: data.prefab,
        name: data.name,
        pack: (self: SceneDataBlock) => SceneDataBlock.pack(self),
        unpack: (data: object) => SceneDataBlock.unpack(data),
      };
    })();
  },
};
