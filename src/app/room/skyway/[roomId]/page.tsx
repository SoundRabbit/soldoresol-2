'use client';

import { Box, Button, Flex, Grid, Stack, Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SidePanelContent } from './SidePanelContent';
import { Input } from '@/component/atom/Input';
import { KeyValue } from '@/component/atom/KeyValue';
import { SidePanel } from '@/component/atom/SidePanel';
import { ModelessContentProps, ModelessMenuProps, ModelessTabProps } from '@/component/molecule/Modeless';
import { ModelessContainer, ModelessContainerController } from '@/component/organism/ModelessContainer';
import { ChatModelessContent, ChatModelessMenu, ChatModelessTab } from '@/component/organism/modelessTab/chat';
import { chatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { chatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { chatMessageDataBlock } from '@/dataBlock/chatObject/chatMessageDataBlock';
import { chatMessageListDataBlock } from '@/dataBlock/chatObject/chatMessageListDataBlock';
import { gameDataBlock } from '@/dataBlock/gameObject/gameDataBlock';
import { useDataBlockTable } from '@/hook/useDataBlock';
import { openColor } from '@/util/openColor';

export const Page = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { dataBlockTable, add: addDataBlock } = useDataBlockTable();
  const gameDataBlockId = useMemo(() => uuidv4(), []);
  const chatDataBlockId = useMemo(() => uuidv4(), []);

  const modelessContainerRef = useRef<ModelessContainerController | null>(null);

  const createNewModeless = useCallback(() => {
    const chatModelessTab = () => ({
      tabId: uuidv4(),
      renderTab: ({ modelessId, tabId, ...props }: ModelessTabProps) => {
        return (
          <ChatModelessTab
            key={`${modelessId}/${tabId}`}
            modelessId={modelessId}
            tabId={tabId}
            chatDataBlockId={chatDataBlockId}
            {...props}
          />
        );
      },
      renderMenu: ({ modelessId, tabId, ...props }: ModelessMenuProps) => {
        return <ChatModelessMenu key={`${modelessId}/${tabId}`} {...props} />;
      },
      renderContent: ({ modelessId, tabId, ...props }: ModelessContentProps) => {
        return (
          <ChatModelessContent
            key={`${modelessId}/${tabId}`}
            modelessId={modelessId}
            tabId={tabId}
            chatDataBlockId={chatDataBlockId}
            {...props}
          />
        );
      },
    });

    if (modelessContainerRef.current) {
      modelessContainerRef.current.openModeless([chatModelessTab(), chatModelessTab(), chatModelessTab()]);
    }
  }, [chatDataBlockId]);

  useEffect(() => {
    if (dataBlockTable[gameDataBlockId] === undefined) {
      const defaultGameDataBlock = gameDataBlock.new({ id: gameDataBlockId });
      addDataBlock(defaultGameDataBlock);
    }
    if (dataBlockTable[chatDataBlockId] === undefined) {
      const defaultChatChannelDataBlocks = [
        chatChannelDataBlock.new({ name: '全体' }),
        chatChannelDataBlock.new({ name: 'GM' }),
      ];
      const defaultChatMessageDataBlocks = [
        chatMessageDataBlock.new({
          filterChannelList: [defaultChatChannelDataBlocks[0].id],
          originalMessage: 'ようこそ！',
        }),
        chatMessageDataBlock.new({
          filterChannelList: [defaultChatChannelDataBlocks[0].id],
          originalMessage: 'こんにちは！',
        }),
        chatMessageDataBlock.new({
          filterChannelList: [defaultChatChannelDataBlocks[1].id],
          originalMessage: 'GMです。',
        }),
      ];
      const defualtChatMessageListDataBlock = chatMessageListDataBlock.new({
        messageList: defaultChatMessageDataBlocks.map((message) => message.id),
      });
      const defaultChatDataBlock = chatDataBlock.new({
        id: chatDataBlockId,
        messageList: defualtChatMessageListDataBlock.id,
        channelList: defaultChatChannelDataBlocks.map((channel) => channel.id),
      });

      for (const channel of defaultChatChannelDataBlocks) {
        addDataBlock(channel);
      }
      for (const message of defaultChatMessageDataBlocks) {
        addDataBlock(message);
      }
      addDataBlock(defualtChatMessageListDataBlock);
      addDataBlock(defaultChatDataBlock);
    }
  }, [dataBlockTable, addDataBlock, gameDataBlockId, chatDataBlockId]);

  return (
    <Flex direction={'column'} width={'100%'} height={'100%'}>
      <Grid
        gridTemplateColumns={'1fr 1fr'}
        gridTemplateRows={'max-content max-content'}
        padding={'1ch'}
        rowGap={'1ch'}
        backgroundColor={openColor.gray[8].hex()}
        color={openColor.gray[0].hex()}
      >
        <KeyValue>
          <Text>ルームID</Text>
          <Input isReadOnly={true} value={roomId} />
        </KeyValue>
        <Box />
        <Stack direction='row'>
          <Button onClick={createNewModeless}>チャット</Button>
        </Stack>
      </Grid>
      <Box position={'relative'} flexGrow={1}>
        <ModelessContainer ref={modelessContainerRef} />
        <SidePanel position={'absolute'} top={0} right={0} bottom={0} panelPposition={'right'}>
          <SidePanelContent />
        </SidePanel>
      </Box>
    </Flex>
  );
};

export default Page;
