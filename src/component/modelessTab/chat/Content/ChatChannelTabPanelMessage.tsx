import React from 'react';

import { ChatMessage } from '@/component/common/ChatMessage';
import { useDataBlock } from '@/hook/useDataBlock';
import { DataBlockId } from '@/libs/dataBlock';
import { ChatMessageDataBlock } from '@/libs/dataBlock/chatObject/chatMessageDataBlock';

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
