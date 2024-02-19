import {
  Grid,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  TabPanel,
  TabPanelProps,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { Button } from '@/component/common/Button';
import { Input } from '@/component/common/Input';
import { Textarea } from '@/component/common/Textarea';
import { DataBlockId } from '@/dataBlock';
import { ChatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { useDataBlock, useDataBlockTable } from '@/hook/useDataBlock';
import { bgColor, txColor } from '@/util/openColor';

type InputableElement = HTMLInputElement | HTMLTextAreaElement;

export type ChannelEditorTabPanelProps = TabPanelProps & {
  chatDataBlockId: DataBlockId;
  chatChannelDataBlockId: DataBlockId;
};

export const ChannelEditorTabPanel: React.FC<ChannelEditorTabPanelProps> = ({
  chatDataBlockId,
  chatChannelDataBlockId,
  ...props
}) => {
  const { remove: removeDataBlock } = useDataBlockTable();
  const { update: updateChat } = useDataBlock(chatDataBlockId, ChatDataBlock.is);
  const { dataBlock: chatChannel, update: updateChatChannel } = useDataBlock(
    chatChannelDataBlockId,
    ChatChannelDataBlock.is,
  );

  const {
    isOpen: isConfirmDeleteChannelModalOpen,
    onOpen: openConfirmDeleteChannelModal,
    onClose: closeConfirmDeleteChannelModal,
  } = useDisclosure();

  const handleInputChatChannelName = useCallback(
    (e: React.ChangeEvent<InputableElement>) => {
      const name = e.currentTarget.value;
      updateChatChannel(async (chatChannel) => {
        return { ...chatChannel, name };
      });
    },
    [updateChatChannel],
  );

  const handleInputChatChannelDescription = useCallback(
    (e: React.ChangeEvent<InputableElement>) => {
      const description = e.currentTarget.value;
      updateChatChannel(async (chatChannel) => {
        return { ...chatChannel, description };
      });
    },
    [updateChatChannel],
  );

  const handleRemoveChatChannel = useCallback(() => {
    updateChat(async (chat) => {
      const channelList = chat.channelList.filter((id) => id !== chatChannelDataBlockId);
      return { ...chat, channelList };
    });
    removeDataBlock(chatChannelDataBlockId);
    closeConfirmDeleteChannelModal();
  }, [updateChat, chatChannelDataBlockId, removeDataBlock, closeConfirmDeleteChannelModal]);

  return (
    <>
      <Grid
        as={TabPanel}
        height={'100%'}
        gridTemplateColumns={'1fr'}
        gridTemplateRows={'1fr max-content'}
        rowGap={'0.5em'}
        {...props}
      >
        <Stack spacing={'0.5em'}>
          <Input defaultValue={chatChannel?.name} onChange={handleInputChatChannelName} />
          <Textarea
            defaultValue={chatChannel?.description}
            placeholder={'チャットタブの説明'}
            onChange={handleInputChatChannelDescription}
            rows={10}
          />
        </Stack>
        <Stack direction={'row-reverse'}>
          <Button
            variant={'unstyled'}
            onClick={openConfirmDeleteChannelModal}
            backgroundColor={bgColor.red[4].hex()}
            color={txColor.gray[0].hex()}
            fontWeight={'normal'}
            padding={'auto 2ch'}
            height={'2.5em'}
            _hover={{ backgroundColor: bgColor.red[3].hex() }}
          >
            チャットタブを削除
          </Button>
        </Stack>
      </Grid>
      <Modal isOpen={isConfirmDeleteChannelModalOpen} onClose={closeConfirmDeleteChannelModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>チャットタブを削除</ModalHeader>
          <ModalBody>チャットタブ #{chatChannel?.name} を削除します。</ModalBody>
          <ModalFooter>
            <Stack direction={'row'}>
              <Button colorVariant={'light'} onClick={closeConfirmDeleteChannelModal}>
                キャンセル
              </Button>
              <Button colorVariant={'red'} onClick={handleRemoveChatChannel}>
                削除
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
