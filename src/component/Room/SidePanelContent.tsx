import React from 'react';

import { Tab, TabList, TabPanels, Tabs, TabsProps } from '@chakra-ui/react';

import { DataBlockId } from '@/libs/dataBlock';
import { NonChildren } from '@/utils/utilityTypes';

import { SceneTabPanel } from './SidePanelContent/SceneTabPanel';

export type SidePanelContentProps = NonChildren<TabsProps> & {
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
