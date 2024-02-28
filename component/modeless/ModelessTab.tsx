'use client';

import * as t from 'io-ts';
import React, { useCallback, useMemo } from 'react';

import { Box, BoxProps, Flex } from '@chakra-ui/react';

import { expect } from '@/lib/util/expect';
import { bgColor, txColor } from '@/lib/util/openColor';

export type OnMoveTab = (srcModelessId: string, dstModelessId: string, srcTabId: string, dstTabIndex: number) => void;

export const modelessTabDataTransfer = t.type({
  isModelessTab: t.literal(true),
  modelessId: t.string,
  tabId: t.string,
  tabIndex: t.number,
});

export type ModelessTabDataTransfer = t.TypeOf<typeof modelessTabDataTransfer>;

export const parseDataTransfer = (e: React.DragEvent<HTMLDivElement>): ModelessTabDataTransfer | undefined => {
  const rawData = e.dataTransfer.getData('application/json');
  if (!rawData || rawData === '') return undefined;
  const parsedData = expect(() => JSON.parse(rawData));
  if (modelessTabDataTransfer.is(parsedData)) {
    return parsedData;
  } else {
    return undefined;
  }
};

export type ModelessTabProps = BoxProps & {
  modelessId: string;
  tabId: string;
  tabIndex: number;
  selectedTabId: string;
  setSelectedTabId: (tabId: string) => void;
  onMoveTab: OnMoveTab;
};

export const ModelessTab: React.FC<ModelessTabProps> = ({
  modelessId,
  tabId,
  tabIndex,
  selectedTabId,
  setSelectedTabId,
  onMoveTab,
  children,
  ...props
}) => {
  const isSelected = selectedTabId === tabId;

  const dataTransfer = useMemo<ModelessTabDataTransfer>(
    () => ({
      isModelessTab: true,
      modelessId,
      tabId,
      tabIndex,
    }),
    [modelessId, tabId, tabIndex],
  );

  const handleDragsStart = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.dataTransfer.setData('application/json', JSON.stringify(dataTransfer));
    },
    [dataTransfer],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const srcDataTransfer = parseDataTransfer(e);
      if (srcDataTransfer) {
        e.preventDefault();
        e.stopPropagation();
        onMoveTab(srcDataTransfer.modelessId, modelessId, srcDataTransfer.tabId, tabIndex);
      }
    },
    [modelessId, onMoveTab, tabIndex],
  );

  const handleStopPropagationMouseEvent = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const handleClick = useCallback(() => {
    setSelectedTabId(tabId);
  }, [setSelectedTabId, tabId]);

  return (
    <Flex
      draggable={true}
      onDragStart={handleDragsStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      onMouseDown={handleStopPropagationMouseEvent}
      alignItems={'center'}
      justifyContent={'start'}
      paddingX={'1ch'}
      paddingTop={'0.4em'}
      paddingBottom={'0.6em'}
      borderRadius={'0.5em 0.5em 0 0'}
      backgroundColor={isSelected ? bgColor.gray[0].hex() : bgColor.gray[3].hex()}
      color={isSelected ? txColor.gray[4].hex() : txColor.gray[0].hex()}
      {...props}
    >
      <Box pointerEvents={'none'}>{children}</Box>
    </Flex>
  );
};
