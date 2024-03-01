'use client';

import { produce } from 'immer';
import React, { useCallback, useMemo } from 'react';

import { Stack, TabPanel, TabPanelProps } from '@chakra-ui/react';

import { Button } from '@/component/Button';

import { DataBlockId } from '@/lib/dataBlock';
import { GameDataBlock } from '@/lib/dataBlock/gameObject/gameDataBlock';
import { SceneDataBlock } from '@/lib/dataBlock/gameObject/sceneDataBlock';
import { TableDataBlock } from '@/lib/dataBlock/gameObject/tableDataBlock';
import { WorkboardDataBlock } from '@/lib/dataBlock/tableObject/workboardDataBlock';
import { useDataBlockState, useDataBlockTable } from '@/lib/hook/useDataBlock';
import { useRoomRendererValue } from '@/lib/hook/useRoomState';
import { TableRendererChannel } from '@/lib/tableRenderer';
import { NonChildren } from '@/lib/type/utilityTypes';

import { SceneListItem } from './SceneListItem';

export type SceneTabPanelProps = NonChildren<TabPanelProps> & {
  gameDataBlockId: DataBlockId;
};

export const SceneTabPanel: React.FC<SceneTabPanelProps> = ({ gameDataBlockId, ...props }) => {
  const { set: setDataBlock } = useDataBlockTable();
  const { dataBlock: game, set: setGame } = useDataBlockState(gameDataBlockId, GameDataBlock.partialIs);
  const roomRenderer = useRoomRendererValue();

  const handleAddScene = useCallback(async () => {
    const workboard = WorkboardDataBlock.create({ name: '新しい盤面', size: [10, 10] });
    const workboardId = await setDataBlock(workboard);
    if (workboardId === undefined) return;

    const mainTable = TableDataBlock.create({ name: '新しいテーブル', workboardList: [workboardId] });
    const mainTableId = await setDataBlock(mainTable);
    if (mainTableId === undefined) return;

    const scene = SceneDataBlock.create({ mainTable: mainTableId }, { name: '新しいシーン' });

    const sceneId = await setDataBlock(scene);
    if (sceneId === undefined) return;

    setGame(async (game) =>
      produce(game, (draft) => {
        draft.sceneList.push(sceneId);
      }),
    );

    if (roomRenderer) {
      TableRendererChannel.setTableDataBlockId(roomRenderer, mainTableId);
    }
  }, [setDataBlock, setGame, roomRenderer]);
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
