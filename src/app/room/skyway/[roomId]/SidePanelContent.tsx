import React from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

export type SidePanelContentProps = {};

export const SidePanelContent: React.FC<SidePanelContentProps> = ({ ...props }) => {
  return (
    <Tabs {...props}>
      <TabList>
        <Tab>シーン</Tab>
      </TabList>
      <TabPanels>
        <TabPanel></TabPanel>
      </TabPanels>
    </Tabs>
  );
};
