'use client';

import React from 'react';

import { MenuDivider, MenuGroup, MenuItem, useDisclosure } from '@chakra-ui/react';

import { ModelessMenuProps } from '@/component/modeless/Modeless';

import { DataBlockId } from '@/lib/dataBlock';

import { ChannelEditorModal } from './ChannelEditorModal';

export type MenuProps = ModelessMenuProps & {
  chatDataBlockId: DataBlockId;
};

export const Menu: React.FC<MenuProps> = ({ chatDataBlockId, tabId }) => {
  const {
    isOpen: isChannelEditorModalOpened,
    onOpen: onOpenChannelEditorModal,
    onClose: onCloseChannelEditorModal,
  } = useDisclosure();

  return (
    <>
      <MenuDivider marginY={'0.5em'} />
      <MenuGroup title={'チャット'} marginTop={'0.5em'} marginBottom={'0'}>
        <MenuItem paddingY={'0.5em'} onClick={onOpenChannelEditorModal}>
          チャットタブを編集
        </MenuItem>
        <MenuItem paddingY={'0.5em'}>発言者を切り替え</MenuItem>
      </MenuGroup>
      <ChannelEditorModal
        isOpen={isChannelEditorModalOpened}
        onClose={onCloseChannelEditorModal}
        chatDataBlockId={chatDataBlockId}
        tabId={tabId}
      />
    </>
  );
};
