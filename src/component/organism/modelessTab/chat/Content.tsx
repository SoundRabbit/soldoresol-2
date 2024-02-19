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
import { chatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { chatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { useDataBlock, useDataBlockList, useDataBlockTable } from '@/hook/useDataBlock';
import { openColor } from '@/util/openColor';

export type ContentProps = FlexProps &
  ModelessContentProps & {
    chatDataBlockId: DataBlockId;
  };

export const Content: React.FC<ContentProps> = ({ tabId, chatDataBlockId }) => {
  const { add: addDataBlock } = useDataBlockTable();
  const { dataBlock: chat, update: updateChat } = useDataBlock(chatDataBlockId, chatDataBlock.is);
  const { dataBlockList: chatChannelList } = useDataBlockList(chat?.channelList ?? [], chatChannelDataBlock.is);
  const { selectedChannelIndex, setSelectedChannelIndex } = useSelectedChannelIndex(tabId);
  const { selectedTargetChannelIdList, setSelectedTargetChannelIdList } = useSelectedTargetChannelIdList(tabId);

  const selectedChannelId = useMemo(() => chat?.channelList.at(selectedChannelIndex), [chat, selectedChannelIndex]);
  const { dataBlock: selectedChannel } = useDataBlock(selectedChannelId, chatChannelDataBlock.is);

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

  const selectTargetChannelToggleProps = useCallback(
    (isToggled: boolean) => ({
      backgroundColor: isToggled ? openColor.blue[5].hex() : openColor.gray[2].hex(),
      color: isToggled ? openColor.gray[0].hex() : openColor.gray[9].hex(),
    }),
    [],
  );

  const addChatChannel = useCallback(() => {
    const channelDataBlock = chatChannelDataBlock.new({ name: '新しいチャンネル' });
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
            <ChatChannelButton key={channelId} chatChanneDataBlocklId={channelId} />
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
        boxShadow={`inset 0px 0px 2px ${openColor.gray[9].hex()}`}
        backgroundColor={'#fff'}
        color={openColor.gray[9].hex()}
        paddingX={'1ch'}
        paddingY={'0.2em'}
      >
        <Grid gridTemplateColumns={'1fr max-content'}>
          <Flex alignItems={'center'} flexWrap={'wrap'}>
            {selectedChannelId ? (
              <MessageTargetToggleButton
                key={selectedChannelId}
                isActive={true}
                chatChannelDataBlockId={selectedChannelId}
                toggleProps={selectTargetChannelToggleProps}
              />
            ) : null}
            {chat?.channelList.map((channelId) => {
              if (channelId === selectedChannelId) return null;

              return (
                <MessageTargetToggleButton
                  key={channelId}
                  chatChannelDataBlockId={channelId}
                  toggleProps={selectTargetChannelToggleProps}
                  onToggle={handleToggleTargetChannel}
                />
              );
            })}
          </Flex>
          <IconButton aria-label='Send' icon={<PaperAirPlaneIcon />} onClick={addChatChannel} />
        </Grid>
        <Textarea
          boxShadow={'none'}
          borderRadius={0}
          padding={0}
          placeholder={`${selectedChannel ? `#${selectedChannel.name}` : ''} ${selectedTargetChannelList
            .filter((channel) => chatChannelDataBlock.is(channel) && channel.id !== selectedChannel?.id)
            .map((channel) => chatChannelDataBlock.is(channel) && `#${channel.name}`)
            .join(' ')} にメッセージを送信`}
        />
      </Grid>
    </Grid>
  );
};
