import { Box, BoxProps, Flex } from '@chakra-ui/react';
import * as t from 'io-ts';
import React, { useCallback } from 'react';
import { useModeless } from '@/hook/useTabModeless';
import { openColor } from '@/util/openColor';

export const modelessTabDataTransfer = t.type({
  isModelessTab: t.literal(true),
  modelessId: t.string,
  tabId: t.string,
});

export type ModelessTabDataTransfer = t.TypeOf<typeof modelessTabDataTransfer>;

export const parseDataTransfer = (e: React.DragEvent<HTMLDivElement>): ModelessTabDataTransfer | undefined => {
  const rawData = e.dataTransfer.getData('application/json');
  if (!rawData || rawData === '') return undefined;
  const parsedData = JSON.parse(rawData);
  if (modelessTabDataTransfer.is(parsedData)) {
    return parsedData;
  } else {
    return undefined;
  }
};

export type ModelessTabProps = {
  modelessId: string;
  tabId: string;
  tabIndex: number;
  selectedTabId: string;
  setSelectedTabId: (tabId: string) => void;
} & BoxProps;

export const ModelessTab: React.FC<ModelessTabProps> = ({
  modelessId,
  tabId,
  tabIndex,
  selectedTabId,
  setSelectedTabId,
  children,
  ...props
}) => {
  const isSelected = selectedTabId === tabId;

  const { moveTab } = useModeless(modelessId);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const data = JSON.stringify({ isModelessTab: true, modelessId, tabId });
      e.dataTransfer.setData('application/json', data);
    },
    [modelessId, tabId],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, movedTabIndex: number) => {
      const data = parseDataTransfer(e);
      if (!data) return;
      e.preventDefault();
      e.stopPropagation();
      moveTab(data.modelessId, modelessId, data.tabId, movedTabIndex);
    },
    [modelessId, moveTab],
  );

  const handleDropLeft = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      handleDrop(e, tabIndex);
    },
    [handleDrop, tabIndex],
  );

  const handleDropRight = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      handleDrop(e, tabIndex + 1);
    },
    [handleDrop, tabIndex],
  );

  const handleClick = useCallback(() => {
    setSelectedTabId(tabId);
  }, [setSelectedTabId, tabId]);

  return (
    <Box
      draggable={true}
      onDragStart={handleDragStart}
      onClick={handleClick}
      position={'relative'}
      backgroundColor={isSelected ? openColor.blue[8].hex() : openColor.gray[1].hex()}
      color={isSelected ? openColor.gray[0].hex() : openColor.gray[8].hex()}
      {...props}
    >
      {children}
      <Flex position={'absolute'} top={0} left={0} right={0} bottom={0}>
        <Box onDrop={handleDropLeft} flexGrow={1} />
        <Box onDrop={handleDropRight} flexGrow={1} />
      </Flex>
    </Box>
  );
};
