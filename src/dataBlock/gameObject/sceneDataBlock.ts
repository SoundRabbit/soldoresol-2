import * as t from 'io-ts';
import { DataBlock, DataBlockId, packedDataBlock } from '@/dataBlock';

export interface SceneDataBlock extends DataBlock {
  prefab?: DataBlockId;
  name: string;
  pack(self: SceneDataBlock): Promise<PackedSceneDataBlock>;
  unpack(data: any): Promise<SceneDataBlock | undefined>;
}

export const packedSceneDataBlock = t.intersection([
  packedDataBlock,
  t.type({ prefab: t.union([t.string, t.undefined]), name: t.string }),
]);

export type PackedSceneDataBlock = t.TypeOf<typeof packedSceneDataBlock>;
