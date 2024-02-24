'use client';

import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';

export type RoomContextData = {
  roomId: string;
};

export const RoomContext = React.createContext<RoomContextData>({
  roomId: '',
});

export const RoomProvider = ({ children }: { children?: React.ReactNode }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const roomContextData = useMemo(() => ({ roomId }), [roomId]);

  return <RoomContext.Provider value={roomContextData}>{children}</RoomContext.Provider>;
};
