import React from 'react';

import { DragHandleIcon } from '@chakra-ui/icons';
import { Tab, TabProps, Text } from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDataBlock } from '@/hook/useDataBlock';
import { DataBlockId } from '@/libs/dataBlock';
import { ChatChannelDataBlock } from '@/libs/dataBlock/chatObject/chatChannelDataBlock';
import { bgColor, txColor } from '@/utils/openColor';

export type ChannelEditorTabButtonProps = Omit<TabProps, 'children'> & {
  chatChannelDataBlockId: DataBlockId;
};

export const ChannelEditorTabButton: React.FC<ChannelEditorTabButtonProps> = ({ chatChannelDataBlockId, ...props }) => {
  const { dataBlock: chatChannel } = useDataBlock(chatChannelDataBlockId, ChatChannelDataBlock.partialIs);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chatChannelDataBlockId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Tab
      borderInlineStart={'unset'}
      marginInlineStart={'unset'}
      borderInlineEnd={'2px solid'}
      marginInlineEnd={'-2px'}
      borderColor={bgColor.gray[1].hex()}
      justifyContent={'start'}
      alignItems={'center'}
      textAlign={'left'}
      paddingLeft={0}
      _selected={{
        borderColor: bgColor.blue[4].hex(),
        color: txColor.blue[4].hex(),
      }}
      /* dnd-kit*/
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      {...props}
    >
      <DragHandleIcon
        color={txColor.gray[4].hex()}
        fontSize={'0.75em'}
        marginX={'1ch'}
        cursor={'grab'}
        _active={{
          cursor: 'grabbing',
        }}
      />
      <Text>{chatChannel?.name}</Text>
    </Tab>
  );
};
