import React from 'react';

import { Box, BoxProps } from '@chakra-ui/react';

import { DataBlockId } from '@/dataBlock';
import { ChatMessageDataBlock } from '@/dataBlock/chatObject/chatMessageDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';

export type ChatMessageProps = BoxProps & {
  chatMessageDataBlockId: DataBlockId;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ chatMessageDataBlockId }) => {
  const { dataBlock: chatMessage } = useDataBlock(chatMessageDataBlockId, ChatMessageDataBlock.is);
  return <Box whiteSpace={'pre-wrap'}>{chatMessage?.originalMessage}</Box>;
};
