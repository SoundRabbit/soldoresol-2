import React from 'react';

import { ChatMessage } from '@/component/ChatMessage';

import { DataBlockId } from '@/lib/dataBlock';
import { ChatMessageDataBlock } from '@/lib/dataBlock/chatObject/chatMessageDataBlock';
import { useDataBlock } from '@/lib/hook/useDataBlock';

export type ChatChannelTabPanelMessageProps = {
  chatMessageDataBlocklId: DataBlockId;
  chatChannelDataBlocklId: DataBlockId;
};

export const ChatChannelTabPanelMessage: React.FC<ChatChannelTabPanelMessageProps> = ({
  chatMessageDataBlocklId,
  chatChannelDataBlocklId,
}) => {
  const { dataBlock: chatMessage } = useDataBlock(chatMessageDataBlocklId, ChatMessageDataBlock.partialIs);

  if (chatMessage?.filterChannelList.includes(chatChannelDataBlocklId)) {
    return <ChatMessage chatMessageDataBlockId={chatMessage.id} />;
  } else {
    return null;
  }
};
