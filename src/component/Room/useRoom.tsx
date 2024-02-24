import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ModelessContentProps, ModelessMenuProps, ModelessTabProps } from '@/component/modeless/Modeless';
import { ModelessContainerController } from '@/component/modeless/ModelessContainer';
import { ChatModelessContent, ChatModelessMenu, ChatModelessTab } from '@/component/modelessTab/chat';
import { DataBlock, DataBlockId } from '@/dataBlock';
import { ChatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/dataBlock/chatObject/chatDataBlock';
import { ChatMessageListDataBlock } from '@/dataBlock/chatObject/chatMessageListDataBlock';
import { GameDataBlock } from '@/dataBlock/gameObject/gameDataBlock';
import { useDataBlockTable } from '@/hook/useDataBlock';
import { Maybe } from '@/util/utilityTypes';

const useInitialDataBlock = ({
  gameDataBlockId,
  chatDataBlockId,
  isExistDataBlock,
  addDataBlock,
}: {
  gameDataBlockId: DataBlockId;
  chatDataBlockId: DataBlockId;
  isExistDataBlock: (id: DataBlockId) => boolean;
  addDataBlock: (dataBlock: DataBlock) => void;
}) => {
  useEffect(() => {
    if (!isExistDataBlock(gameDataBlockId)) {
      const defaultGameDataBlock = GameDataBlock.create({ id: gameDataBlockId });
      addDataBlock(defaultGameDataBlock);
    }
    if (!isExistDataBlock(chatDataBlockId)) {
      const chatChannelDescription = [
        'チャットタブの追加 / 削除 / 編集方法',
        'ウィンドウ右上の「≡」（ハンバーガーメニュー）から「チャットタブを編集」を選択してください。',
      ].join('\n');
      const defaultChatChannelDataBlocks = [
        ChatChannelDataBlock.create({ name: 'メイン', description: chatChannelDescription }),
        ChatChannelDataBlock.create({ name: '情報' }),
        ChatChannelDataBlock.create({ name: '雑談' }),
      ];
      const defualtChatMessageListDataBlock = ChatMessageListDataBlock.create();
      const defaultChatDataBlock = ChatDataBlock.create(
        { messageList: defualtChatMessageListDataBlock.id },
        {
          id: chatDataBlockId,
          channelList: defaultChatChannelDataBlocks.map((channel) => channel.id),
        },
      );

      for (const channel of defaultChatChannelDataBlocks) {
        addDataBlock(channel);
      }

      addDataBlock(defualtChatMessageListDataBlock);
      addDataBlock(defaultChatDataBlock);
    }
  }, [isExistDataBlock, addDataBlock, gameDataBlockId, chatDataBlockId]);
};

const useOpenChatModeless = (
  chatDataBlockId: DataBlockId,
  modelessContainerControllerRef: MutableRefObject<Maybe<ModelessContainerController, null>>,
) => {
  const openChatModeless = useCallback(() => {
    if (modelessContainerControllerRef.current) {
      const chatModelessTab = {
        tabId: uuidv4(),
        renderTab: ({ modelessId, tabId, ...props }: ModelessTabProps) => {
          return (
            <ChatModelessTab
              key={`${modelessId}/${tabId}`}
              modelessId={modelessId}
              tabId={tabId}
              chatDataBlockId={chatDataBlockId}
              {...props}
            />
          );
        },
        renderMenu: ({ modelessId, tabId, ...props }: ModelessMenuProps) => {
          return (
            <ChatModelessMenu
              key={`${modelessId}/${tabId}`}
              modelessId={modelessId}
              tabId={tabId}
              chatDataBlockId={chatDataBlockId}
              {...props}
            />
          );
        },
        renderContent: ({ modelessId, tabId, ...props }: ModelessContentProps) => {
          return (
            <ChatModelessContent
              key={`${modelessId}/${tabId}`}
              modelessId={modelessId}
              tabId={tabId}
              chatDataBlockId={chatDataBlockId}
              {...props}
            />
          );
        },
      };
      modelessContainerControllerRef.current.openModeless([chatModelessTab]);
    }
  }, [chatDataBlockId, modelessContainerControllerRef]);

  return openChatModeless;
};

export const useRoom = (gameDataBlockId: DataBlockId, chatDataBlockId: DataBlockId) => {
  const { isExist: isExistDataBlock, add: addDataBlock } = useDataBlockTable();

  const modelessContainerControllerRef = useRef<Maybe<ModelessContainerController, null>>(null);

  const openChatModeless = useOpenChatModeless(chatDataBlockId, modelessContainerControllerRef);

  useInitialDataBlock({ gameDataBlockId, chatDataBlockId, isExistDataBlock, addDataBlock });

  return { openChatModeless, modelessContainerControllerRef };
};
