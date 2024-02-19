import { Box, BoxProps, Collapse, Flex, FlexProps, Grid, GridProps, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ChevronDownIcon } from '@/component/common/icon/ChevronDownIcon';
import { ChevronUpIcon } from '@/component/common/icon/ChevronUpIcon';
import { DataBlockId } from '@/dataBlock';
import { ChatChannelDataBlock } from '@/dataBlock/chatObject/chatChannelDataBlock';
import { useDataBlock } from '@/hook/useDataBlock';
import { useRefState } from '@/hook/useRefState';

export type ChatChannelTabPanelDescriptionProps = Omit<FlexProps, 'children'> & {
  chatChannelDataBlockId: DataBlockId;
  buttonProps?: GridProps;
  panelProps?: BoxProps;
  parentElement?: HTMLElement | null;
};

export const ChatChannelTabPanelDescription: React.FC<ChatChannelTabPanelDescriptionProps> = ({
  chatChannelDataBlockId,
  buttonProps,
  panelProps,
  parentElement,
  ...props
}) => {
  const { dataBlock: chatChannel } = useDataBlock(chatChannelDataBlockId, ChatChannelDataBlock.is);
  const description = useMemo(() => chatChannel?.description ?? '', [chatChannel]);

  const [title, text] = useMemo(() => {
    const [title, ...text] = description.split('\n');
    const reducedText = text.reduce((acc, cur) => {
      if (acc.length === 0 && cur.length === 0) {
        return acc;
      } else {
        acc.push(cur);
        return acc;
      }
    }, [] as string[]);
    return [title, reducedText.join('\n')];
  }, [description]);

  const [isExpanded, isExpandedRef, setIsExpanded] = useRefState(false);
  const [isAvailable, isAvailableRef, setIsAvailable] = useRefState(true);
  const isHidden = !isAvailable;

  const handleClose = useCallback(() => {
    if (isAvailableRef.current && isExpandedRef.current) {
      setIsExpanded(false);
      setIsAvailable(false);
    }
  }, [isAvailableRef, isExpandedRef, setIsAvailable, setIsExpanded]);

  const handleToogle = useCallback(() => {
    if (isAvailableRef.current) {
      setIsExpanded((prev) => !prev);
      setIsAvailable(false);
    }
  }, [isAvailableRef, setIsAvailable, setIsExpanded]);

  useEffect(() => {
    if (isAvailable) return;

    const timeout = isExpandedRef.current ? 400 : 300;

    window.setTimeout(() => {
      setIsAvailable(true);
    }, timeout);
  }, [isAvailable, setIsAvailable, isExpandedRef]);

  useEffect(() => {
    parentElement?.addEventListener('click', handleClose);
    return () => {
      parentElement?.removeEventListener('click', handleClose);
    };
  }, [handleClose, parentElement]);

  return (
    (title.length > 0 || text.length > 0) && (
      <Grid
        onClick={handleToogle}
        maxHeight={'100%'}
        overflow={'hidden'}
        gridTemplateColumns={'1fr'}
        gridTemplateRows={'max-content 1fr'}
        {...props}
      >
        <Flex alignItems={'center'} paddingX={'var(--scrollbar-width)'} {...buttonProps}>
          <Text
            flexGrow={1}
            overflow={'hidden'}
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            pointerEvents={'none'}
            textAlign={'left'}
          >
            {title}
          </Text>
          {text.length > 0 && (isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />)}
        </Flex>
        <Collapse in={isExpanded} animateOpacity>
          {!(isAvailable && isHidden) && (
            <Box
              overflowY={isHidden ? 'hidden' : 'scroll'}
              height={'100%'}
              css={{ scrollbarGutter: 'stable both-edges' }}
            >
              <Text whiteSpace={'pre-wrap'} {...panelProps}>
                {text}
              </Text>
            </Box>
          )}
        </Collapse>
      </Grid>
    )
  );
};
