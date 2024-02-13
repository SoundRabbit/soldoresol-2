import { ChatIcon } from '@chakra-ui/icons';
import React from 'react';
import { ModelessTab } from '@/component/atom/ModelessTab';

export type TabProps = {
  modelessId: string;
  tabId: string;
  tabIndex: number;
  selectedTabId: string;
  setSelectedTabId: (tabId: string) => void;
};

export const Tab: React.FC<TabProps> = ({ modelessId, tabId, tabIndex, selectedTabId, setSelectedTabId }) => {
  return (
    <ModelessTab
      modelessId={modelessId}
      tabId={tabId}
      tabIndex={tabIndex}
      selectedTabId={selectedTabId}
      setSelectedTabId={setSelectedTabId}
    >
      <ChatIcon />
      チャット {tabId.slice(0, 4)}
    </ModelessTab>
  );
};
