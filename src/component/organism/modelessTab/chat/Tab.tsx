import { ChatIcon } from '@chakra-ui/icons';
import { Grid, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useChatModelessTab } from './useChatModelessTab';
import { ModelessTab, ModelessTabProps } from '@/component/atom/ModelessTab';
import { DataBlockId } from '@/dataBlock';
import { chatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { chatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';

export type TabProps = ModelessTabProps & {
  chatDataBlockId: DataBlockId;
};

export const Tab: React.FC<TabProps> = ({ tabId, chatDataBlockId, ...modelessTabProps }) => {
  const { dataBlock: chat } = useDataBlock(chatDataBlockId, chatDataBlock.is);
  const { selectedChannelIndex } = useChatModelessTab(tabId);
  const selectedChannelId = useMemo(() => chat?.channelList.at(selectedChannelIndex), [chat, selectedChannelIndex]);
  const { dataBlock: selectedChatChannel } = useDataBlock(selectedChannelId, chatChannelDataBlock.is);

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
