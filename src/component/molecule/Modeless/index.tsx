import { HamburgerIcon } from '@chakra-ui/icons';
import { Flex, FlexProps, IconButton, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { parseDataTransfer } from '@/component/atom/ModelessTab';
import { Modeless as ModelessPayload, useModeless, useModelessTabTable } from '@/hook/useTabModeless';

export type ModelessProps = {
  modelessId: string;
  payload: ModelessPayload;
} & FlexProps;

export const Modeless: React.FC<ModelessProps> = ({ modelessId, payload, ...props }) => {
  const { tabTable } = useModelessTabTable();
  const [selectedTabId, setSelectedTabId] = useState<string>(payload.tabs.at(0) ?? '');
  const { moveTab } = useModeless(modelessId);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const data = parseDataTransfer(e);
      if (!data) return;
      e.preventDefault();
      e.stopPropagation();
      moveTab(data.modelessId, modelessId, data.tabId, 0);
    },
    [modelessId, moveTab],
  );

  return (
    <Flex onDragOver={handleDragOver} {...props}>
      <Flex onDrop={handleDrop}>
        <Flex>
          {payload.tabs.map((tabId, tabIndex) =>
            tabTable[tabId]?.renderTab(modelessId, tabId, tabIndex, selectedTabId, setSelectedTabId),
          )}
        </Flex>
        <Menu>
          <MenuButton as={IconButton} aria-label='Options' icon={<HamburgerIcon />} variant='outline' />
          <MenuList>{tabTable[selectedTabId]?.renderMenu(modelessId, selectedTabId)}</MenuList>
        </Menu>
      </Flex>
      {tabTable[selectedTabId]?.renderContent(modelessId, selectedTabId)}
    </Flex>
  );
};
