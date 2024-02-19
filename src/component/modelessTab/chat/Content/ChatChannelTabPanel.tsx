import { Stack, TabPanel, TabPanelProps } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { ChatChannelTabPanelDescription } from './ChatChannelTabPanelDescription';
import { ChatChannelTabPanelMessage } from './ChatChannelTabPanelMessage';
import { DataBlockId } from '@/dataBlock';
import { ChatMessageListDataBlock } from '@/dataBlock/chatObject/chatMessageListDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';
import { bgColor, txColor } from '@/util/openColor';

export type ChatChannelTabPanelProps = TabPanelProps & {
  chatMessageListDataBlockId: DataBlockId;
  chatChannelDataBlocklId: DataBlockId;
};
export const ChatChannelTabPanel: React.FC<ChatChannelTabPanelProps> = ({
  chatMessageListDataBlockId,
  chatChannelDataBlocklId,
  ...props
}) => {
  const { dataBlock: chatMessageList } = useDataBlock(chatMessageListDataBlockId, ChatMessageListDataBlock.is);
  const descriptionParentRef = useRef<HTMLDivElement>(null);

  return (
    <TabPanel ref={descriptionParentRef} height={'100%'} position={'relative'} paddingTop={'2em'} {...props}>
      <Stack height={'100%'} overflowY={'scroll'}>
        {chatMessageList?.messageList.map((messageId) => (
          <ChatChannelTabPanelMessage
            key={messageId}
            chatChannelDataBlocklId={chatChannelDataBlocklId}
            chatMessageDataBlocklId={messageId}
          />
        ))}
      </Stack>
      <ChatChannelTabPanelDescription
        chatChannelDataBlockId={chatChannelDataBlocklId}
        parentElement={descriptionParentRef.current}
        width={'100%'}
        position={'absolute'}
        top={0}
        left={0}
        color={txColor.gray[0].hex()}
        backgroundColor={bgColor.gray[4].fade(0.1).hexa()}
        fontSize={'0.8em'}
        buttonProps={{ height: '2em', fontSize: '1em' }}
        panelProps={{ className: 'bg-dark', fontSize: '1em', paddingTop: '0em', paddingBottom: '0.5em' }}
      />
    </TabPanel>
  );
};
