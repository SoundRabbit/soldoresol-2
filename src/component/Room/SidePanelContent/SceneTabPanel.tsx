import React, { useCallback, useMemo } from 'react';

import { Stack, TabPanel, TabPanelProps } from '@chakra-ui/react';

import { Button } from '@/component/common/Button';
import { DataBlockId } from '@/dataBlock';
import { GameDataBlock } from '@/dataBlock/gameObject/gameDataBlock';
import { SceneDataBlock } from '@/dataBlock/gameObject/sceneDataBlock';
import { TableDataBlock } from '@/dataBlock/gameObject/tableDataBlock';
import { useDataBlock, useDataBlockTable } from '@/hook/useDataBlock';
import { NonChildren } from '@/util/utilityTypes';

import { SceneListItem } from './SceneTabPanel/SceneListItem';

export type SceneTabPanelProps = NonChildren<TabPanelProps> & {
  gameDataBlockId: DataBlockId;
};

export const SceneTabPanel: React.FC<SceneTabPanelProps> = ({ gameDataBlockId, ...props }) => {
  const { add: addDataBlock } = useDataBlockTable();
  const { dataBlock: game, update: updateGame } = useDataBlock(gameDataBlockId, GameDataBlock.partialIs);

  const handleAddScene = useCallback(() => {
    const mainTable = TableDataBlock.create({ name: '新しいテーブル' });
    const mainTableId = addDataBlock(mainTable);
    if (mainTableId === undefined) return;

    const scene = SceneDataBlock.create({ mainTable: mainTableId }, { name: '新しいシーン' });

    const sceneId = addDataBlock(scene);
    if (sceneId === undefined) return;

    updateGame(async (game) => {
      const sceneList = [...game.sceneList, sceneId];
      return { ...game, sceneList };
    });
  }, [addDataBlock, updateGame]);
  const sceneIdList = useMemo(() => game?.sceneList ?? [], [game]);

  return (
    <TabPanel {...props}>
      <Stack>
        {sceneIdList.map((sceneId) => (
          <SceneListItem key={sceneId} sceneDataBlockId={sceneId} />
        ))}
        <Button colorVariant={'blue'} styleVariant={'outline'} onClick={handleAddScene}>
          シーンを追加
        </Button>
      </Stack>
    </TabPanel>
  );
};
