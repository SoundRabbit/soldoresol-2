import { TabPanel, TabPanelProps } from '@chakra-ui/react';
import React from 'react';
import { ChatChannelPanelMessage } from './ChatChannelPanelMessage';
import { DataBlockId } from '@/dataBlock';
import { ChatMessageListDataBlock } from '@/dataBlock/chatObject/chatMessageListDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';

export type ChatChannelPanelProps = TabPanelProps & {
  chatMessageListDataBlockId: DataBlockId;
  chatChannelDataBlocklId: DataBlockId;
};
export const ChatChannelPanel: React.FC<ChatChannelPanelProps> = ({
  chatMessageListDataBlockId,
  chatChannelDataBlocklId,
  ...props
}) => {
  const { dataBlock: chatMessageList } = useDataBlock(chatMessageListDataBlockId, ChatMessageListDataBlock.is);

  return (
    <TabPanel height={'100%'} {...props}>
      {chatMessageList?.messageList.map((messageId) => (
        <ChatChannelPanelMessage
          key={messageId}
          chatChannelDataBlocklId={chatMessageListDataBlockId}
          chatMessageDataBlocklId={messageId}
        />
      ))}
    </TabPanel>
  );
};
