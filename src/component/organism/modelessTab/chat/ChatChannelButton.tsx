import { Tab, TabProps } from '@chakra-ui/react';
import React from 'react';
import { DataBlockId } from '@/dataBlock';
import { chatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';

export type ChatChannelButtonProps = TabProps & {
  chatChanneDataBlocklId: DataBlockId;
};

export const ChatChannelButton: React.FC<ChatChannelButtonProps> = ({ chatChanneDataBlocklId, ...props }) => {
  const { dataBlock: chatChannel } = useDataBlock(chatChanneDataBlocklId, chatChannelDataBlock.is);

  return (
    <Tab {...props}>
      {'#'}
      {chatChannel?.name}
    </Tab>
  );
};
