'use client';

import React from 'react';

import { FlexProps } from '@chakra-ui/react';

import { RoomId, useSetRoomIdEffect, useSetRoomRendererEffect } from '@/lib/hook/useRoomState';

export type PageProviderProps = FlexProps & {
  roomId: RoomId;
  children: React.ReactNode;
};

export const PageProvider: React.FC<PageProviderProps> = ({ roomId, children }) => {
  useSetRoomIdEffect(roomId);
  useSetRoomRendererEffect();

  return children;
};
