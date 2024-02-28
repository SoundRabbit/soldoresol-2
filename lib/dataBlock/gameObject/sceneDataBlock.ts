import * as t from 'io-ts';
import { Assign } from 'utility-types';

import { DataBlock, DataBlockId, PackedDataBlock } from '@/lib/dataBlock';

export const dataBlockType = 'Scene';

export type SceneDataBlock = Assign<
  DataBlock,
  { dataBlockType: typeof dataBlockType; name: string; mainTable: DataBlockId; tableList: DataBlockId[] }
>;

export const PackedSceneDataBlock = t.intersection([
  PackedDataBlock,
  t.type({
    dataBlockType: t.literal(dataBlockType),
    name: t.string,
    mainTable: DataBlockId,
    tableList: t.array(DataBlockId),
  }),
]);

export type PackedSceneDataBlock = t.TypeOf<typeof PackedSceneDataBlock>;

export const SceneDataBlock = {
  dataBlockType,

  partialIs(data: any): data is SceneDataBlock {
    return typeof data === 'object' && data.dataBlockType === dataBlockType;
  },

  create(props: { mainTable: DataBlockId }, option?: Partial<SceneDataBlock>): SceneDataBlock {
    const id = option?.id ?? DataBlockId.create();
    const mainTable = option?.mainTable ?? props.mainTable;
    const name = option?.name ?? '';
    const tableList = option?.tableList ?? [];
    return {
      id,
      dataBlockType: dataBlockType,
      mainTable,
      name,
      tableList,
    };
  },

  pack(self: SceneDataBlock): Promise<PackedSceneDataBlock> {
    return (async () => {
      return {
        id: self.id,
        dataBlockType: self.dataBlockType,
        name: self.name,
        mainTable: self.mainTable,
        tableList: self.tableList,
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
        mainTable: data.mainTable,
        tableList: data.tableList,
      };
    })();
  },
};
