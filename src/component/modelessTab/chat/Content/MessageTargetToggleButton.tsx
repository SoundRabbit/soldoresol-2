import React, { useCallback } from 'react';

import { ToggleButton, ToggleButtonProps } from '@/component/common/ToggleButton';
import { DataBlockId } from '@/dataBlock';
import { ChatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';

export type MessageTargetToggleButtonProps = Omit<ToggleButtonProps, 'onToggle'> & {
  chatChannelDataBlockId: DataBlockId;
  onToggle?: (isToggled: boolean, chatChannelDataBlockId: DataBlockId) => void;
};

export const MessageTargetToggleButton: React.FC<MessageTargetToggleButtonProps> = ({
  chatChannelDataBlockId,
  onToggle,
  ...props
}) => {
  const { dataBlock: chatChannel } = useDataBlock(chatChannelDataBlockId, ChatChannelDataBlock.is);

  const handleToggleTarget = useCallback(
    (isToggled: boolean) => {
      onToggle?.(isToggled, chatChannelDataBlockId);
    },
    [chatChannelDataBlockId, onToggle],
  );

  return (
    <ToggleButton onToggle={handleToggleTarget} {...props}>
      #{chatChannel?.name}
    </ToggleButton>
  );
};