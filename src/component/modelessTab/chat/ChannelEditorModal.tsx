import React, { useCallback, useMemo, useRef, useState } from 'react';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Tab,
  TabList,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

import { DataBlockId } from '@/dataBlock';
import { ChatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { useDataBlock, useDataBlockList, useDataBlockTable } from '@/hook/useDataBlock';
import { useTabIndex } from '@/hook/useTabIndex';
import { bgColor, txColor } from '@/util/openColor';

import { ChannelEditorTabButton } from './ChannelEditorModal/ChannelEditorTabButton';
import { ChannelEditorTabPanel } from './ChannelEditorModal/ChannelEditorTabPanel';

export type ChannelEditorModalProps = Omit<ModalProps, 'children'> & {
  chatDataBlockId: DataBlockId;
  tabId: string;
};

export const ChannelEditorModal: React.FC<ChannelEditorModalProps> = ({
  chatDataBlockId,
  tabId,
  onClose,
  ...props
}) => {
  const { add: addDataBlock } = useDataBlockTable();
  const { dataBlock: chat, update: updateChat } = useDataBlock(chatDataBlockId, ChatDataBlock.partialIs);
  const chatChannelIdList = useMemo(() => chat?.channelList ?? [], [chat]);
  const chatChannelIdListRef = useRef<string[]>([]);
  chatChannelIdListRef.current = chatChannelIdList;

  const { dataBlockList: chatChannelList } = useDataBlockList(chatChannelIdList, ChatChannelDataBlock.partialIs);
  const chatChannelListLengthRef = useRef(0);
  chatChannelListLengthRef.current = useMemo(() => chatChannelList.length, [chatChannelList]);

  const [selectedChannelId, setSelectedChannelId] = useState(chatChannelIdList.at(0) ?? DataBlockId.none);
  const tabIndex = useTabIndex(selectedChannelId, chatChannelIdList);

  const { setNodeRef } = useDroppable({
    id: `${tabId}/ChannelEditorModal`,
  });

  const handleChangeTab = useCallback(
    (index: number) => {
      if (index === chatChannelListLengthRef.current) {
        const channelDataBlock = ChatChannelDataBlock.create({ name: '新しいタブ' });
        addDataBlock(channelDataBlock);
        updateChat(async (chat) => ({ ...chat, channelList: [...chat.channelList, channelDataBlock.id] }));
      }
      setSelectedChannelId(chatChannelIdListRef.current.at(index) ?? DataBlockId.none);
    },
    [addDataBlock, updateChat],
  );

  const handleDropChannel = useCallback(
    (event: DragEndEvent) => {
      const { over, active } = event;
      if (over?.id === active.id) {
        return;
      }
      const newChannelList = [...chatChannelList];
      const overIndex = newChannelList.findIndex((channel) => channel.id === over?.id);
      const activeIndex = newChannelList.findIndex((channel) => channel.id === active.id);
      if (overIndex === -1 || activeIndex === -1) {
        return;
      }
      newChannelList.splice(overIndex, 0, newChannelList.splice(activeIndex, 1)[0]);
      updateChat(async (chat) => ({ ...chat, channelList: newChannelList.map((channel) => channel.id) }));
    },
    [chatChannelList, updateChat],
  );

  return (
    <Modal onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent maxWidth={'min(56rem, 95vw)'} backgroundColor={bgColor.gray[0].hex()}>
        <ModalHeader>チャットタブを編集</ModalHeader>
        <ModalCloseButton />
        <Tabs as={ModalBody} orientation={'vertical'} index={tabIndex} onChange={handleChangeTab} paddingLeft={0}>
          <DndContext onDragEnd={handleDropChannel}>
            <TabList
              minWidth={'20ch'}
              maxWidth={'max-content'}
              borderInlineStart={'unset'}
              borderInlineEnd={'2px solid'}
              borderColor={bgColor.gray[1].hex()}
              ref={setNodeRef}
            >
              <SortableContext items={chatChannelIdList}>
                {chatChannelList.map((channel) => (
                  <ChannelEditorTabButton key={channel.id} chatChannelDataBlockId={channel.id} />
                ))}
              </SortableContext>
              <Tab
                borderInlineStart={'unset'}
                marginInlineStart={'unset'}
                backgroundColor={bgColor.gray[1].hex()}
                color={txColor.blue[4].hex()}
              >
                +追加
              </Tab>
            </TabList>
          </DndContext>
          <TabPanels>
            {chatChannelList.map((channel) => (
              <ChannelEditorTabPanel
                key={channel.id}
                chatDataBlockId={chatDataBlockId}
                chatChannelDataBlockId={channel.id}
              />
            ))}
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  );
};
