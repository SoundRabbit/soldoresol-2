'use client';

import React from 'react';

import { Box, BoxProps } from '@chakra-ui/react';

import { DataBlockId } from '@/lib/dataBlock';
import { ChatMessageDataBlock } from '@/lib/dataBlock/chatObject/chatMessageDataBlock';
import { useDataBlockValue } from '@/lib/hook/useDataBlock';

export type ChatMessageProps = BoxProps & {
  chatMessageDataBlockId: DataBlockId;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ chatMessageDataBlockId }) => {
  const chatMessage = useDataBlockValue(chatMessageDataBlockId, ChatMessageDataBlock.partialIs);
  return <Box whiteSpace={'pre-wrap'}>{chatMessage?.originalMessage}</Box>;
};
