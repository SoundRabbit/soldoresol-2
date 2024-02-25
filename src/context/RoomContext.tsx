'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import { TableRendererChannel } from '@/libs/tableRenderer';
import { Maybe } from '@/utils/utilityTypes';

export type RoomContextData = {
  roomId: string;
  renderer: Maybe<TableRendererChannel>;
};

export const RoomContext = React.createContext<RoomContextData>({
  roomId: '',
  renderer: undefined,
});

export const RoomProvider = ({ children }: { children?: React.ReactNode }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const [renderer, setRenderer] = useState<Maybe<TableRendererChannel>>(undefined);

  const roomData = useMemo(() => ({ roomId, renderer }), [roomId, renderer]);

  useEffect(() => {
    const renderer = TableRendererChannel.create();
    setRenderer(renderer);
  }, []);

  return <RoomContext.Provider value={roomData}>{children}</RoomContext.Provider>;
};
