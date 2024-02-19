import { ChatIcon } from '@chakra-ui/icons';
import { Grid, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useSelectedChannelIndex } from './useChatModelessTab';
import { ModelessTab, ModelessTabProps } from '@/component/atom/ModelessTab';
import { DataBlockId } from '@/dataBlock';
import { ChatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';

export type TabProps = ModelessTabProps & {
  chatDataBlockId: DataBlockId;
};

export const Tab: React.FC<TabProps> = ({ tabId, chatDataBlockId, ...modelessTabProps }) => {
  const { dataBlock: chat } = useDataBlock(chatDataBlockId, ChatDataBlock.is);
  const { selectedChannelIndex } = useSelectedChannelIndex(tabId);
  const selectedChannelId = useMemo(
    () => chat?.channelList.at(selectedChannelIndex) ?? DataBlockId.none,
    [chat, selectedChannelIndex],
  );
  const { dataBlock: selectedChatChannel } = useDataBlock(selectedChannelId, ChatChannelDataBlock.is);

  return (
    <ModelessTab tabId={tabId} {...modelessTabProps}>
      <Grid gridTemplateColumns={'max-content 1fr'} alignItems={'center'} columnGap={'1ch'}>
        <ChatIcon />
        <Grid
          gridTemplateColumns={'minmax(10ch, 8fr) 5fr'}
          alignItems={'end'}
          columnGap={'0.25ch'}
          whiteSpace={'nowrap'}
        >
          <Text overflow={'hidden'} textOverflow={'ellipsis'}>
            プレイヤー
          </Text>
          <Text fontSize={'0.8em'} overflow={'hidden'} textOverflow={'ellipsis'}>
            {selectedChatChannel?.name ? `#${selectedChatChannel.name}` : null}
          </Text>
        </Grid>
      </Grid>
    </ModelessTab>
  );
};
