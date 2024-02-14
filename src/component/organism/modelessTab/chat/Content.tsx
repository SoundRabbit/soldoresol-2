import { Box, FlexProps, Grid, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { ChatChannelButton } from './ChatChannelButton';
import { ChatChannelPanel } from './ChatChannelPanel';
import { useChatModelessTab } from './useChatModelessTab';
import { ModelessContentProps } from '@/component/molecule/Modeless';
import { DataBlockId } from '@/dataBlock';
import { chatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';

export type ContentProps = FlexProps &
  ModelessContentProps & {
    chatDataBlockId: DataBlockId;
  };

export const Content: React.FC<ContentProps> = ({ tabId, chatDataBlockId }) => {
  const { dataBlock: chat } = useDataBlock(chatDataBlockId, chatDataBlock.is);
  const { selectedChannelIndex, setSelectedChannelIndex } = useChatModelessTab(tabId);

  const handleChangeSelectedChannelIndex = useCallback(
    (index: number) => {
      setSelectedChannelIndex(index);
    },
    [setSelectedChannelIndex],
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
        <TabList>
          {chat?.channelList.map((channelId) => (
            <ChatChannelButton key={channelId} chatChanneDataBlocklId={channelId} />
          ))}
        </TabList>
        <TabPanels>
          {chat?.channelList.map((channelId) => (
            <ChatChannelPanel
              key={channelId}
              chatChanneDataBlocklId={channelId}
              chatMessageListDataBlockId={chat!.messageList}
            />
          ))}
        </TabPanels>
      </Tabs>
      <Box></Box>
    </Grid>
  );
};
