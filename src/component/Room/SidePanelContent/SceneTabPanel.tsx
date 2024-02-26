import React, { useCallback, useContext, useMemo } from 'react';

import { Stack, TabPanel, TabPanelProps } from '@chakra-ui/react';

import { Button } from '@/component/common/Button';
import { RoomContext } from '@/context/RoomContext';
import { useDataBlock, useDataBlockTable } from '@/hook/useDataBlock';
import { DataBlockId } from '@/libs/dataBlock';
import { GameDataBlock } from '@/libs/dataBlock/gameObject/gameDataBlock';
import { SceneDataBlock } from '@/libs/dataBlock/gameObject/sceneDataBlock';
import { TableDataBlock } from '@/libs/dataBlock/gameObject/tableDataBlock';
import { WorkboardDataBlock } from '@/libs/dataBlock/tableObject/workboardDataBlock';
import { TableRendererChannel } from '@/libs/tableRenderer';
import { NonChildren } from '@/utils/utilityTypes';

import { SceneListItem } from './SceneTabPanel/SceneListItem';

export type SceneTabPanelProps = NonChildren<TabPanelProps> & {
  gameDataBlockId: DataBlockId;
};

export const SceneTabPanel: React.FC<SceneTabPanelProps> = ({ gameDataBlockId, ...props }) => {
  const { set: setDataBlock } = useDataBlockTable();
  const { dataBlock: game, set: setGame } = useDataBlock(gameDataBlockId, GameDataBlock.partialIs);
  const roomContext = useContext(RoomContext);

  const handleAddScene = useCallback(async () => {
    const workboard = WorkboardDataBlock.create({ size: [10, 10] });
    const workboardId = await setDataBlock(workboard);
    if (workboardId === undefined) return;

    const mainTable = TableDataBlock.create({ name: '新しいテーブル', workboardList: [workboardId] });
    const mainTableId = await setDataBlock(mainTable);
    if (mainTableId === undefined) return;

    const scene = SceneDataBlock.create({ mainTable: mainTableId }, { name: '新しいシーン' });

    const sceneId = await setDataBlock(scene);
    if (sceneId === undefined) return;

    setGame(async (game) => {
      const sceneList = [...game.sceneList, sceneId];
      return { ...game, sceneList };
    });

    if (roomContext) {
      TableRendererChannel.setTableDataBlockId(roomContext.renderer, mainTableId);
    }
  }, [setDataBlock, setGame, roomContext]);
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
