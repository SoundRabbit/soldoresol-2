import { TabPanel, TabPanelProps } from '@chakra-ui/react';
import React from 'react';
import { ChatMessage } from '@/component/atom/ChatMessage';
import { DataBlockId } from '@/dataBlock';
import { chatMessageDataBlock } from '@/dataBlock/chatObject/chatMessageDataBlock';
import { chatMessageListDataBlock } from '@/dataBlock/chatObject/chatMessageListDataBlock';
import { useDataBlock, useDataBlockTable } from '@/hook/useDataBlock';

export type ChatChannelPanelProps = TabPanelProps & {
  chatMessageListDataBlockId: DataBlockId;
  chatChanneDataBlocklId: DataBlockId;
};

export const ChatChannelPanel: React.FC<ChatChannelPanelProps> = ({
  chatMessageListDataBlockId,
  chatChanneDataBlocklId,
  ...props
}) => {
  const { dataBlockTable } = useDataBlockTable();
  const { dataBlock: chatMessageList } = useDataBlock(chatMessageListDataBlockId, chatMessageListDataBlock.is);

  return (
    <TabPanel height={'100%'} {...props}>
      {chatMessageList?.messageList.map((messageId) => {
        const chatMessage = dataBlockTable[messageId];
        if (chatMessageDataBlock.is(chatMessage) && chatMessage.filterChannelList.includes(chatChanneDataBlocklId)) {
          return <ChatMessage key={messageId} chatMessageDataBlockId={messageId} />;
        } else {
          return null;
        }
      })}
    </TabPanel>
  );
};
