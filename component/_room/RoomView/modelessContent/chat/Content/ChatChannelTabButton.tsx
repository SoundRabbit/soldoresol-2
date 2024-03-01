import React from 'react';

import { Tab, TabProps } from '@chakra-ui/react';

import { DataBlockId } from '@/lib/dataBlock';
import { ChatChannelDataBlock } from '@/lib/dataBlock/chatObject/chatChannelDataBlock';
import { useDataBlockValue } from '@/lib/hook/useDataBlock';

export type ChatChannelTabButtonProps = TabProps & {
  chatChanneDataBlocklId: DataBlockId;
};

export const ChatChannelTabButton: React.FC<ChatChannelTabButtonProps> = ({ chatChanneDataBlocklId, ...props }) => {
  const chatChannel = useDataBlockValue(chatChanneDataBlocklId, ChatChannelDataBlock.partialIs);

  return (
    <Tab {...props}>
      {'#'}
      {chatChannel?.name}
    </Tab>
  );
};
