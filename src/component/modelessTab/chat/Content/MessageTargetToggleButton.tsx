import React, { useCallback } from 'react';

import { ToggleButton, ToggleButtonProps } from '@/component/common/ToggleButton';
import { useDataBlock } from '@/hook/useDataBlock';
import { DataBlockId } from '@/libs/dataBlock';
import { ChatChannelDataBlock } from '@/libs/dataBlock/chatObject/chatChannelDataBlock';

export type MessageTargetToggleButtonProps = Omit<ToggleButtonProps, 'onToggle'> & {
  chatChannelDataBlockId: DataBlockId;
  onToggle?: (isToggled: boolean, chatChannelDataBlockId: DataBlockId) => void;
};

export const MessageTargetToggleButton: React.FC<MessageTargetToggleButtonProps> = ({
  chatChannelDataBlockId,
  onToggle,
  ...props
}) => {
  const { dataBlock: chatChannel } = useDataBlock(chatChannelDataBlockId, ChatChannelDataBlock.partialIs);

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
