'use client';

import { Box, Button, Flex, Grid, Stack, Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SidePanelContent } from './SidePanelContent';
import { Input } from '@/component/common/Input';
import { KeyValue } from '@/component/common/KeyValue';
import { SidePanel } from '@/component/common/SidePanel';
import { ModelessContentProps, ModelessMenuProps, ModelessTabProps } from '@/component/modeless/Modeless';
import { ModelessContainer, ModelessContainerController } from '@/component/modeless/ModelessContainer';
import { ChatModelessContent, ChatModelessMenu, ChatModelessTab } from '@/component/modelessTab/chat';
import { ChatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { ChatMessageListDataBlock } from '@/dataBlock/chatObject/chatMessageListDataBlock';
import { GameDataBlock } from '@/dataBlock/gameObject/gameDataBlock';
import { useDataBlockTable } from '@/hook/useDataBlock';
import { bgColor, txColor } from '@/util/openColor';

export const Page = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { isExist: isExistDataBlock, add: addDataBlock } = useDataBlockTable();
  const gameDataBlockId = useMemo(() => uuidv4(), []);
  const chatDataBlockId = useMemo(() => uuidv4(), []);

  const modelessContainerRef = useRef<ModelessContainerController | null>(null);

  const createNewModeless = useCallback(() => {
    if (modelessContainerRef.current) {
      const chatModelessTab = {
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
          return (
            <ChatModelessMenu
              key={`${modelessId}/${tabId}`}
              modelessId={modelessId}
              tabId={tabId}
              chatDataBlockId={chatDataBlockId}
              {...props}
            />
          );
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
      };
      modelessContainerRef.current.openModeless([chatModelessTab]);
    }
  }, [chatDataBlockId]);

  useEffect(() => {
    if (!isExistDataBlock(gameDataBlockId)) {
      const defaultGameDataBlock = GameDataBlock.create({ id: gameDataBlockId });
      addDataBlock(defaultGameDataBlock);
    }
    if (!isExistDataBlock(chatDataBlockId)) {
      const chatChannelDescription = [
        'チャットタブの追加 / 削除 / 編集方法',
        'ウィンドウ右上の「≡」（ハンバーガーメニュー）から「チャットタブを編集」を選択してください。',
      ].join('\n');
      const defaultChatChannelDataBlocks = [
        ChatChannelDataBlock.create({ name: 'メイン', description: chatChannelDescription }),
        ChatChannelDataBlock.create({ name: '情報' }),
        ChatChannelDataBlock.create({ name: '雑談' }),
      ];
      const defualtChatMessageListDataBlock = ChatMessageListDataBlock.create();
      const defaultChatDataBlock = ChatDataBlock.create({
        id: chatDataBlockId,
        messageList: defualtChatMessageListDataBlock.id,
        channelList: defaultChatChannelDataBlocks.map((channel) => channel.id),
      });

      for (const channel of defaultChatChannelDataBlocks) {
        addDataBlock(channel);
      }

      addDataBlock(defualtChatMessageListDataBlock);
      addDataBlock(defaultChatDataBlock);
    }
  }, [isExistDataBlock, addDataBlock, gameDataBlockId, chatDataBlockId]);

  return (
    <Flex direction={'column'} width={'100%'} height={'100%'}>
      <Grid
        gridTemplateColumns={'1fr 1fr'}
        gridTemplateRows={'max-content max-content'}
        padding={'1ch'}
        rowGap={'1ch'}
        backgroundColor={bgColor.gray[4].hex()}
        color={txColor.gray[0].hex()}
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
