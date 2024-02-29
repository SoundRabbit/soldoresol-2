'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Box, FlexProps, Grid, IconButton, Stack, TabList, TabPanels, Tabs, Text } from '@chakra-ui/react';

import { Textarea } from '@/component/Textarea';
import { PaperAirPlaneIcon } from '@/component/icon/PaperAirPlaneIcon';
import { ModelessContentPanelProps } from '@/component/modeless/Modeless';

import { DataBlockId } from '@/lib/dataBlock';
import { ChatChannelDataBlock } from '@/lib/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/lib/dataBlock/chatObject/chatDataBlock';
import { ChatMessageDataBlock } from '@/lib/dataBlock/chatObject/chatMessageDataBlock';
import { ChatMessageListDataBlock } from '@/lib/dataBlock/chatObject/chatMessageListDataBlock';
import { useDataBlock, useDataBlockList, useDataBlockTable } from '@/lib/hook/useDataBlock';
import { bgColor, txColor } from '@/lib/util/openColor';

import { useSelectedChannelIdValueWithTabIndex, useSetSelectedChannelId } from '../useChatModelessTab';

import { ChatChannelTabButton } from './ChatChannelTabButton';
import { ChatChannelTabPanel } from './ChatChannelTabPanel';
import { MessageTargetToggleButton } from './MessageTargetToggleButton';

export type ContentProps = FlexProps &
  ModelessContentPanelProps & {
    chatDataBlockId: DataBlockId;
  };

export const Content: React.FC<ContentProps> = ({ contentId, chatDataBlockId }) => {
  const { set: setDataBlock } = useDataBlockTable();
  const { dataBlock: chat } = useDataBlock(chatDataBlockId, ChatDataBlock.partialIs);
  const { set: setMessageList } = useDataBlock(
    chat?.messageList ?? DataBlockId.none,
    ChatMessageListDataBlock.partialIs,
  );

  const chatChannelIdList = useMemo(() => chat?.channelList ?? [], [chat]);
  const chatChannelIdListRef = useRef<string[]>([]);
  chatChannelIdListRef.current = chatChannelIdList;

  const { dataBlockList: chatChannelList } = useDataBlockList(chatChannelIdList, ChatChannelDataBlock.partialIs);

  const { selectedChannelId, tabIndex } = useSelectedChannelIdValueWithTabIndex(contentId, chatChannelIdList);
  const { setSelectedChannelId } = useSetSelectedChannelId(contentId);

  const { dataBlock: selectedChannel } = useDataBlock(selectedChannelId, ChatChannelDataBlock.partialIs);

  const [selectedTargetChannelIdSet, setSelectedTargetChannelIdSet] = useState(new Set<DataBlockId>());

  const selectedTargetChannelList = useMemo(
    () =>
      chatChannelList.filter(
        (channel) => channel.id !== selectedChannelId && selectedTargetChannelIdSet.has(channel.id),
      ),
    [chatChannelList, selectedTargetChannelIdSet, selectedChannelId],
  );

  const [chatMessage, setChatMessage] = useState('');
  const [chatMessageKey, setChatMessageKey] = useState(0);

  const handleChangeSelectedChannelIndex = useCallback(
    (index: number) => {
      setSelectedChannelId((prevId) => {
        const nextId = chatChannelIdListRef.current.at(index) ?? DataBlockId.none;
        if (prevId !== nextId) {
          setSelectedTargetChannelIdSet(new Set());
        }
        return nextId;
      });
    },
    [setSelectedChannelId],
  );

  const handleToggleTargetChannel = useCallback((isToggled: boolean, chatChannelDataBlockId: DataBlockId) => {
    setSelectedTargetChannelIdSet((selectedTargetChannelIdSet) => {
      const newSet = new Set(selectedTargetChannelIdSet);
      if (isToggled) {
        newSet.add(chatChannelDataBlockId);
      } else {
        newSet.delete(chatChannelDataBlockId);
      }
      return newSet;
    });
  }, []);

  const handleInputChatMessage = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatMessage(e.currentTarget.value);
  }, []);

  const handleSendChatMessage = useCallback(async () => {
    if (selectedChannel) {
      const filterChannelList = Array.from(selectedTargetChannelIdSet);

      const newMessage = ChatMessageDataBlock.create({
        originalMessage: chatMessage,
        filterChannelList: [selectedChannel.id, ...filterChannelList],
      });

      const messageId = await setDataBlock(newMessage);

      await setMessageList(async (messageListDataBlock) => {
        if (messageId) {
          const newMessageList = [...messageListDataBlock.messageList, messageId];
          return { ...messageListDataBlock, messageList: newMessageList };
        } else {
          return messageListDataBlock;
        }
      });
      setChatMessage('');
      setChatMessageKey((prevKey) => prevKey + 1);
    }
  }, [setDataBlock, setMessageList, chatMessage, selectedTargetChannelIdSet, selectedChannel]);

  const handleKeyDownInTextarea = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendChatMessage();
      }
    },
    [handleSendChatMessage],
  );

  return (
    <Grid gridTemplateColumns={'1fr'} gridTemplateRows={'1fr max-content'} width={'100%'} height={'100%'}>
      <Tabs
        isLazy={true}
        isManual={true}
        index={tabIndex}
        orientation={'horizontal'}
        onChange={handleChangeSelectedChannelIndex}
        display={'grid'}
        gridTemplateColumns={'1fr'}
        gridTemplateRows={'max-content 1fr'}
        overflow={'hidden'}
      >
        <TabList flexWrap={'wrap'} paddingTop={'0.5em'} borderColor={bgColor.gray[1].hex()}>
          {chat?.channelList.map((channelId) => (
            <ChatChannelTabButton
              key={channelId}
              chatChanneDataBlocklId={channelId}
              fontSize={'0.8rem'}
              paddingX={'1ch'}
              paddingY={'0.5em'}
              borderColor={bgColor.gray[1].hex()}
              _selected={{ color: txColor.blue[4].hex(), borderColor: bgColor.blue[4].hex() }}
            />
          ))}
        </TabList>
        <TabPanels overflow={'hidden'}>
          {chat?.channelList.map((channelId) => (
            <ChatChannelTabPanel
              key={channelId}
              chatChannelDataBlocklId={channelId}
              chatMessageListDataBlockId={chat!.messageList}
            />
          ))}
        </TabPanels>
      </Tabs>
      <Grid
        gridTemplateColumns={'1fr'}
        gridTemplateRows={'max-content 1fr'}
        boxShadow={`inset 0px 0px 2px ${bgColor.gray[4].hex()}`}
        backgroundColor={'#fff'}
        color={txColor.gray[4].hex()}
        paddingX={'1ch'}
        paddingY={'0.2em'}
      >
        <Grid gridTemplateColumns={'1fr max-content'}>
          <Stack direction={'row'} spacing={'0.7rch'} alignItems={'center'} flexWrap={'wrap'}>
            {chat?.channelList.map((channelId) => (
              <MessageTargetToggleButton
                key={channelId}
                isActive={channelId === selectedChannelId || selectedTargetChannelIdSet.has(channelId)}
                chatChannelDataBlockId={channelId}
                onToggle={handleToggleTargetChannel}
                fontSize={'0.7rem'}
                padding={'0.2em 1ch'}
                backgroundColor={bgColor.gray[0].hex()}
                color={txColor.gray[4].hex()}
                data-is-selected-channel={channelId === selectedChannelId}
                sx={{
                  '&[data-is-selected="true"]&[data-is-selected-channel="false"]': {
                    backgroundColor: bgColor.green[4].hex(),
                    color: txColor.gray[0].hex(),
                  },
                  '&[data-is-selected="true"]&[data-is-selected-channel="true"]': {
                    backgroundColor: bgColor.blue[4].hex(),
                    color: txColor.gray[0].hex(),
                  },
                }}
              />
            ))}
          </Stack>
          <IconButton aria-label='Send' icon={<PaperAirPlaneIcon />} onClick={handleSendChatMessage} />
        </Grid>
        <Box>
          <Textarea
            key={chatMessageKey}
            defaultValue={chatMessage}
            onChange={handleInputChatMessage}
            onKeyDown={handleKeyDownInTextarea}
            boxShadow={'none'}
            borderRadius={0}
            padding={0}
            placeholder={`${selectedChannel ? `#${selectedChannel.name}` : ''} ${selectedTargetChannelList
              .filter((channel) => ChatChannelDataBlock.partialIs(channel) && channel.id !== selectedChannel?.id)
              .map((channel) => ChatChannelDataBlock.partialIs(channel) && `#${channel.name}`)
              .join(' ')} にメッセージを送信`}
          />
          <Stack direction={'row'} spacing={'2ch'} fontSize={'0.7rem'}>
            <Text>Shift + Enter で改行</Text>
            <Text>Enter で送信</Text>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};
