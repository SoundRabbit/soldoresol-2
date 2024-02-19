import { Flex, FlexProps, Grid, IconButton, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useCallback, useMemo } from 'react';
import { ChatChannelButton } from './implContent/ChatChannelButton';
import { ChatChannelPanel } from './implContent/ChatChannelPanel';
import { MessageTargetToggleButton } from './implContent/MessageTargetToggleButton';
import { useSelectedChannelIndex, useSelectedTargetChannelIdList } from './useChatModelessTab';
import { Textarea } from '@/component/atom/Textarea';
import { PaperAirPlaneIcon } from '@/component/atom/icon/PaperAirPlaneIcon';
import { ModelessContentProps } from '@/component/molecule/Modeless';
import { DataBlockId } from '@/dataBlock';
import { ChatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { useDataBlock, useDataBlockList, useDataBlockTable } from '@/hook/useDataBlock';
import { bgColor, txColor } from '@/util/openColor';

export type ContentProps = FlexProps &
  ModelessContentProps & {
    chatDataBlockId: DataBlockId;
  };

export const Content: React.FC<ContentProps> = ({ tabId, chatDataBlockId }) => {
  const { add: addDataBlock } = useDataBlockTable();
  const { dataBlock: chat, update: updateChat } = useDataBlock(chatDataBlockId, ChatDataBlock.is);
  const { dataBlockList: chatChannelList } = useDataBlockList(chat?.channelList ?? [], ChatChannelDataBlock.is);
  const { selectedChannelIndex, setSelectedChannelIndex } = useSelectedChannelIndex(tabId);
  const { selectedTargetChannelIdList, setSelectedTargetChannelIdList } = useSelectedTargetChannelIdList(tabId);

  const selectedChannelId = useMemo(() => chat?.channelList.at(selectedChannelIndex), [chat, selectedChannelIndex]);
  const { dataBlock: selectedChannel } = useDataBlock(selectedChannelId, ChatChannelDataBlock.is);

  const selectedTargetChannelList = useMemo(
    () =>
      chatChannelList?.filter(
        (channel) => channel && channel.id !== selectedChannelId && selectedTargetChannelIdList.includes(channel.id),
      ) ?? [],
    [chatChannelList, selectedTargetChannelIdList, selectedChannelId],
  );

  const handleChangeSelectedChannelIndex = useCallback(
    (index: number) => {
      setSelectedChannelIndex(index);
    },
    [setSelectedChannelIndex],
  );

  const handleAddChatChannel = useCallback(() => {
    const channelDataBlock = ChatChannelDataBlock.create({ name: '新しいチャンネル' });
    addDataBlock(channelDataBlock);
    updateChat(async (chat) => ({ ...chat, channelList: [...chat.channelList, channelDataBlock.id] }));
  }, [addDataBlock, updateChat]);

  const handleToggleTargetChannel = useCallback(
    (isToggled: boolean, chatChannelDataBlockId: DataBlockId) => {
      setSelectedTargetChannelIdList((selectedTargetChannelIdList) =>
        isToggled
          ? [...selectedTargetChannelIdList, chatChannelDataBlockId]
          : selectedTargetChannelIdList.filter((id) => id !== chatChannelDataBlockId),
      );
    },
    [setSelectedTargetChannelIdList],
  );

  return (
    <Grid gridTemplateColumns={'1fr'} gridTemplateRows={'1fr max-content'} width={'100%'} height={'100%'}>
      <Tabs
        isLazy={true}
        isManual={true}
        index={selectedChannelIndex}
        onChange={handleChangeSelectedChannelIndex}
        display={'grid'}
        gridTemplateColumns={'1fr'}
        gridTemplateRows={'max-content 1fr'}
      >
        <Flex as={TabList} flexWrap={'wrap'}>
          {chat?.channelList.map((channelId) => (
            <ChatChannelButton
              key={channelId}
              chatChanneDataBlocklId={channelId}
              fontSize={'0.8rem'}
              paddingX={'1ch'}
              paddingY={'0.5em'}
            />
          ))}
        </Flex>
        <TabPanels>
          {chat?.channelList.map((channelId) => (
            <ChatChannelPanel
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
          <Flex alignItems={'center'} flexWrap={'wrap'}>
            {chat?.channelList.map((channelId) => (
              <MessageTargetToggleButton
                key={channelId}
                isActive={channelId === selectedChannelId || selectedTargetChannelIdList.includes(channelId)}
                chatChannelDataBlockId={channelId}
                onToggle={handleToggleTargetChannel}
                fontSize={'0.7rem'}
                marginX={'0.5ch'}
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
          </Flex>
          <IconButton aria-label='Send' icon={<PaperAirPlaneIcon />} onClick={handleAddChatChannel} />
        </Grid>
        <Textarea
          boxShadow={'none'}
          borderRadius={0}
          padding={0}
          placeholder={`${selectedChannel ? `#${selectedChannel.name}` : ''} ${selectedTargetChannelList
            .filter((channel) => ChatChannelDataBlock.is(channel) && channel.id !== selectedChannel?.id)
            .map((channel) => ChatChannelDataBlock.is(channel) && `#${channel.name}`)
            .join(' ')} にメッセージを送信`}
        />
      </Grid>
    </Grid>
  );
};
