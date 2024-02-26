import React from 'react';

import { Box, BoxProps } from '@chakra-ui/react';

import { useDataBlock } from '@/hook/useDataBlock';
import { DataBlockId } from '@/libs/dataBlock';
import { ChatMessageDataBlock } from '@/libs/dataBlock/chatObject/chatMessageDataBlock';

export type ChatMessageProps = BoxProps & {
  chatMessageDataBlockId: DataBlockId;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ chatMessageDataBlockId }) => {
  const { dataBlock: chatMessage } = useDataBlock(chatMessageDataBlockId, ChatMessageDataBlock.partialIs);
  return <Box whiteSpace={'pre-wrap'}>{chatMessage?.originalMessage}</Box>;
};
