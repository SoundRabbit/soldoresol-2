import React from 'react';

import { Tab, TabList, TabPanels, Tabs } from '@chakra-ui/react';

import { DataBlockId } from '@/libs/dataBlock';

import { SceneTabPanel } from './SidePanelContent/SceneTabPanel';

export type SidePanelContentProps = {
  gameDataBlockId: DataBlockId;
};

export const SidePanelContent: React.FC<SidePanelContentProps> = ({ gameDataBlockId, ...props }) => {
  return (
    <Tabs {...props}>
      <TabList>
        <Tab>シーン</Tab>
      </TabList>
      <TabPanels>
        <SceneTabPanel gameDataBlockId={gameDataBlockId} />
      </TabPanels>
    </Tabs>
  );
};
