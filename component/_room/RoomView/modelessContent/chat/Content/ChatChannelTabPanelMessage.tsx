'use client';

import React from 'react';

import { ChatMessage } from '@/component/ChatMessage';

import { DataBlockId } from '@/lib/dataBlock';
import { ChatMessageDataBlock } from '@/lib/dataBlock/chatObject/chatMessageDataBlock';
import { useDataBlockValue } from '@/lib/hook/useDataBlock';

export type ChatChannelTabPanelMessageProps = {
  chatMessageDataBlocklId: DataBlockId;
  chatChannelDataBlocklId: DataBlockId;
};

export const ChatChannelTabPanelMessage: React.FC<ChatChannelTabPanelMessageProps> = ({
  chatMessageDataBlocklId,
  chatChannelDataBlocklId,
}) => {
  const chatMessage = useDataBlockValue(chatMessageDataBlocklId, ChatMessageDataBlock.partialIs);

  if (chatMessage?.filterChannelList.includes(chatChannelDataBlocklId)) {
    return <ChatMessage chatMessageDataBlockId={chatMessage.id} />;
  } else {
    return null;
  }
};
