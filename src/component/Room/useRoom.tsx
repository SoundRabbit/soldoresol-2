import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ModelessContentProps, ModelessMenuProps, ModelessTabProps } from '@/component/modeless/Modeless';
import { ModelessContainerController } from '@/component/modeless/ModelessContainer';
import { ChatModelessContent, ChatModelessMenu, ChatModelessTab } from '@/component/modelessTab/chat';
import { useDataBlockTable } from '@/hook/useDataBlock';
import { DataBlock, DataBlockId } from '@/libs/dataBlock';
import { ChatChannelDataBlock } from '@/libs/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/libs/dataBlock/chatObject/chatDataBlock';
import { ChatMessageListDataBlock } from '@/libs/dataBlock/chatObject/chatMessageListDataBlock';
import { GameDataBlock } from '@/libs/dataBlock/gameObject/gameDataBlock';
import { Maybe } from '@/utils/utilityTypes';

const useInitialDataBlock = ({
  gameDataBlockId,
  chatDataBlockId,
  setDataBlock,
}: {
  gameDataBlockId: DataBlockId;
  chatDataBlockId: DataBlockId;
  setDataBlock: (dataBlock: DataBlock) => void;
}) => {
  useEffect(() => {
    const defaultGameDataBlock = GameDataBlock.create({ id: gameDataBlockId });
    setDataBlock(defaultGameDataBlock);

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
      setDataBlock(channel);
    }

    setDataBlock(defualtChatMessageListDataBlock);
    setDataBlock(defaultChatDataBlock);
  }, [setDataBlock, gameDataBlockId, chatDataBlockId]);
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
  const { set: setDataBlock } = useDataBlockTable();

  const modelessContainerControllerRef = useRef<Maybe<ModelessContainerController, null>>(null);

  const openChatModeless = useOpenChatModeless(chatDataBlockId, modelessContainerControllerRef);

  useInitialDataBlock({ gameDataBlockId, chatDataBlockId, setDataBlock });

  return { openChatModeless, modelessContainerControllerRef };
};
