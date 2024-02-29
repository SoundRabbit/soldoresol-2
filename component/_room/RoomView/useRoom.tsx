import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  ModelessContentMenuProps,
  ModelessContentPanelProps,
  ModelessContentTabProps,
} from '@/component/modeless/Modeless';
import { ModelessContainerController } from '@/component/modeless/ModelessContainer';

import { DataBlock, DataBlockId } from '@/lib/dataBlock';
import { ChatChannelDataBlock } from '@/lib/dataBlock/chatObject/chatChannelDataBlock';
import { ChatDataBlock } from '@/lib/dataBlock/chatObject/chatDataBlock';
import { ChatMessageListDataBlock } from '@/lib/dataBlock/chatObject/chatMessageListDataBlock';
import { GameDataBlock } from '@/lib/dataBlock/gameObject/gameDataBlock';
import { useDataBlockTable } from '@/lib/hook/useDataBlock';
import { Maybe } from '@/lib/type/utilityTypes';

import { ChatModelessContent, ChatModelessMenu, ChatModelessTab } from './modelessContent/chat';

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
        contentId: uuidv4(),
        renderTab: ({ modelessId, contentId, ...props }: ModelessContentTabProps) => {
          return (
            <ChatModelessTab
              key={`${modelessId}/${contentId}`}
              modelessId={modelessId}
              contentId={contentId}
              chatDataBlockId={chatDataBlockId}
              {...props}
            />
          );
        },
        renderMenu: ({ modelessId, contentId, ...props }: ModelessContentMenuProps) => {
          return (
            <ChatModelessMenu
              key={`${modelessId}/${contentId}`}
              modelessId={modelessId}
              contentId={contentId}
              chatDataBlockId={chatDataBlockId}
              {...props}
            />
          );
        },
        renderPanel: ({ modelessId, contentId, ...props }: ModelessContentPanelProps) => {
          return (
            <ChatModelessContent
              key={`${modelessId}/${contentId}`}
              modelessId={modelessId}
              contentId={contentId}
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
