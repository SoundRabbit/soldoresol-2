'use client';

import { RoomContextProvider } from '@/component/context/RoomContext';

export type RoomProviderProps = {
  roomId: string;
  children?: React.ReactNode;
};

export const RoomProvider: React.FC<RoomProviderProps> = ({ roomId, children }) => {
  return <RoomContextProvider roomId={roomId}>{children}</RoomContextProvider>;
};
