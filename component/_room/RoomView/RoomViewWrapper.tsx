'use client';

import React from 'react';
import { useRecoilValue } from 'recoil';

import { Flex, FlexProps } from '@chakra-ui/react';

import { canvasDraggingState } from './useCanvas';

export type RoomViewWrapperProps = FlexProps & {};

export const RoomViewWrapper: React.FC<RoomViewWrapperProps> = ({ children, ...props }) => {
  const isCanvasDragging = useRecoilValue(canvasDraggingState);

  return (
    <Flex sx={isCanvasDragging ? { '*': { userSelect: 'none' } } : {}} {...props}>
      {children}
    </Flex>
  );
};
