'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { TableRendererChannel } from '@/lib/tableRenderer';
import { Maybe } from '@/lib/type/utilityTypes';

export type RoomContextData = {
  roomId: string;
  renderer: TableRendererChannel;
};

export const RoomContext = React.createContext<Maybe<RoomContextData>>(undefined);

export type RoomProviderProps = {
  roomId: string;
  children?: React.ReactNode;
};

export const RoomContextProvider = ({ children, roomId }: RoomProviderProps) => {
  const [rendererChannel, setRendererChannel] = useState<Maybe<TableRendererChannel>>(undefined);

  const roomData = useMemo(
    () => (rendererChannel ? { roomId, renderer: rendererChannel } : undefined),
    [roomId, rendererChannel],
  );

  useEffect(() => {
    const renderer = TableRendererChannel.create();
    setRendererChannel((prev) => {
      prev?.worker?.terminate();
      return renderer;
    });
  }, []);

  return <RoomContext.Provider value={roomData}>{children}</RoomContext.Provider>;
};
