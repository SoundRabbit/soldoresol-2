import React from 'react';

import { Tab, TabProps } from '@chakra-ui/react';

import { useDataBlock } from '@/hook/useDataBlock';
import { DataBlockId } from '@/libs/dataBlock';
import { ChatChannelDataBlock } from '@/libs/dataBlock/chatObject/chatChannelDataBlock';

export type ChatChannelTabButtonProps = TabProps & {
  chatChanneDataBlocklId: DataBlockId;
};

export const ChatChannelTabButton: React.FC<ChatChannelTabButtonProps> = ({ chatChanneDataBlocklId, ...props }) => {
  const { dataBlock: chatChannel } = useDataBlock(chatChanneDataBlocklId, ChatChannelDataBlock.partialIs);

  return (
    <Tab {...props}>
      {'#'}
      {chatChannel?.name}
    </Tab>
  );
};
