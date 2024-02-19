import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';
import { DataBlockId } from '@/dataBlock';
import { ChatMessageDataBlock } from '@/dataBlock/chatObject/chatMessageDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';

export type ChatMessageProps = BoxProps & {
  chatMessageDataBlockId: DataBlockId;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ chatMessageDataBlockId }) => {
  const { dataBlock: chatMessage } = useDataBlock(chatMessageDataBlockId, ChatMessageDataBlock.is);
  return <Box>{chatMessage?.originalMessage}</Box>;
};
