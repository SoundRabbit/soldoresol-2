'use client';

import React from 'react';

import { ChatIcon } from '@chakra-ui/icons';
import { Grid, Text } from '@chakra-ui/react';

import { ModelessTab, ModelessTabProps } from '@/component/modeless/ModelessTab';

import { DataBlockId } from '@/lib/dataBlock';
import { ChatChannelDataBlock } from '@/lib/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/lib/dataBlock/chatObject/chatDataBlock';
import { useDataBlock } from '@/lib/hook/useDataBlock';

import { useSelectedChannelId } from './useChatModelessTab';

export type TabProps = ModelessTabProps & {
  chatDataBlockId: DataBlockId;
};

export const Tab: React.FC<TabProps> = ({ tabId, chatDataBlockId, ...modelessTabProps }) => {
  const { dataBlock: chat } = useDataBlock(chatDataBlockId, ChatDataBlock.partialIs);
  const { selectedChannelId } = useSelectedChannelId(tabId, chat?.channelList ?? []);
  const { dataBlock: selectedChatChannel } = useDataBlock(selectedChannelId, ChatChannelDataBlock.partialIs);

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
