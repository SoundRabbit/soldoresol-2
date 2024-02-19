import React from 'react';
import { ChatMessage } from '@/component/atom/ChatMessage';
import { DataBlockId } from '@/dataBlock';
import { chatMessageDataBlock } from '@/dataBlock/chatObject/chatMessageDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';

export type ChatChannelPanelMessageProps = {
  chatMessageDataBlocklId: DataBlockId;
  chatChannelDataBlocklId: DataBlockId;
};

export const ChatChannelPanelMessage: React.FC<ChatChannelPanelMessageProps> = ({
  chatMessageDataBlocklId,
  chatChannelDataBlocklId,
}) => {
  const { dataBlock: chatMessage } = useDataBlock(chatMessageDataBlocklId, chatMessageDataBlock.is);

  if (chatMessage?.filterChannelList.includes(chatChannelDataBlocklId)) {
    return <ChatMessage chatMessageDataBlockId={chatMessage.id} />;
  } else {
    return null;
  }
};
