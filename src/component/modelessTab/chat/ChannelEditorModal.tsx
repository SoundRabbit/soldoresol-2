import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import React from 'react';
import { DataBlockId } from '@/dataBlock';
import { ChatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { useDataBlock, useDataBlockList } from '@/hook/useDataBlock';

export type ChannelEditorModalProps = Omit<ModalProps, 'children'> & {
  chatDataBlockId: DataBlockId;
  tabId: string;
};

export const ChannelEditorModal: React.FC<ChannelEditorModalProps> = ({
  chatDataBlockId,
  tabId,
  onClose,
  ...props
}) => {
  const { dataBlock: chat } = useDataBlock(chatDataBlockId, ChatDataBlock.is);
  const { dataBlockList: chatChannelList } = useDataBlockList(chat?.channelList ?? [], ChatChannelDataBlock.is);

  return (
    <Modal onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>チャットタブを編集</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            決定
          </Button>
          <Button variant='ghost'>Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
