import React from 'react';

import { Tab, TabProps } from '@chakra-ui/react';

import { DataBlockId } from '@/dataBlock';
import { ChatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';

export type ChatChannelTabButtonProps = TabProps & {
  chatChanneDataBlocklId: DataBlockId;
};

export const ChatChannelTabButton: React.FC<ChatChannelTabButtonProps> = ({ chatChanneDataBlocklId, ...props }) => {
  const { dataBlock: chatChannel } = useDataBlock(chatChanneDataBlocklId, ChatChannelDataBlock.is);

  return (
    <Tab {...props}>
      {'#'}
      {chatChannel?.name}
    </Tab>
  );
};
