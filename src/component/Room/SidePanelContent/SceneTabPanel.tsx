import React, { useCallback, useMemo } from 'react';

import { Stack, TabPanel, TabPanelProps } from '@chakra-ui/react';

import { Button } from '@/component/common/Button';
import { useDataBlock, useDataBlockTable } from '@/hook/useDataBlock';
import { DataBlockId } from '@/libs/dataBlock';
import { GameDataBlock } from '@/libs/dataBlock/gameObject/gameDataBlock';
import { SceneDataBlock } from '@/libs/dataBlock/gameObject/sceneDataBlock';
import { TableDataBlock } from '@/libs/dataBlock/gameObject/tableDataBlock';
import { NonChildren } from '@/utils/utilityTypes';

import { SceneListItem } from './SceneTabPanel/SceneListItem';

export type SceneTabPanelProps = NonChildren<TabPanelProps> & {
  gameDataBlockId: DataBlockId;
};

export const SceneTabPanel: React.FC<SceneTabPanelProps> = ({ gameDataBlockId, ...props }) => {
  const { set: setDataBlock } = useDataBlockTable();
  const { dataBlock: game, set: setGame } = useDataBlock(gameDataBlockId, GameDataBlock.partialIs);

  const handleAddScene = useCallback(async () => {
    const mainTable = TableDataBlock.create({ name: '新しいテーブル' });
    const mainTableId = await setDataBlock(mainTable);
    if (mainTableId === undefined) return;

    const scene = SceneDataBlock.create({ mainTable: mainTableId }, { name: '新しいシーン' });

    const sceneId = await setDataBlock(scene);
    if (sceneId === undefined) return;

    setGame(async (game) => {
      const sceneList = [...game.sceneList, sceneId];
      return { ...game, sceneList };
    });
  }, [setDataBlock, setGame]);
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
