import React from 'react';

import { ChatMessage } from '@/component/common/ChatMessage';
import { DataBlockId } from '@/dataBlock';
import { ChatMessageDataBlock } from '@/dataBlock/chatObject/chatMessageDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';

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
