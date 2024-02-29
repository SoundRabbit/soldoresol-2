import React from 'react';

import { Tab, TabList, TabPanels, Tabs, TabsProps } from '@chakra-ui/react';

import { DataBlockId } from '@/lib/dataBlock';
import { NonChildren } from '@/lib/type/utilityTypes';

import { SceneTabPanel } from './SceneTabPanel';

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
