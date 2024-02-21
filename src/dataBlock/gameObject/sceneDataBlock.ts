import * as t from 'io-ts';
import { Assign } from 'utility-types';

import { DataBlock, PackedDataBlock } from '@/dataBlock';

export const dataBlockType = 'Scene';

export type SceneDataBlock = Assign<DataBlock, { dataBlockType: typeof dataBlockType; name: string }>;

export const PackedSceneDataBlock = t.intersection([
  PackedDataBlock,
  t.type({ dataBlockType: t.literal(dataBlockType), name: t.string }),
]);

export type PackedSceneDataBlock = t.TypeOf<typeof PackedSceneDataBlock>;

export const SceneDataBlock = {
  dataBlockType,

  partialIs(data: any): data is SceneDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props?: Partial<SceneDataBlock>): SceneDataBlock {
    const id = props?.id ?? '';
    const name = props?.name ?? '';
    return {
      id,
      dataBlockType,
      name,
    };
  },

  pack(self: SceneDataBlock): Promise<PackedSceneDataBlock> {
    return (async () => {
      return {
        id: self.id,
        dataBlockType: self.dataBlockType,
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
        name: data.name,
      };
    })();
  },
};
