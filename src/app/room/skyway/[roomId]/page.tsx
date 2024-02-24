'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Room } from '@/component/Room';

export const Page = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const gameDataBlockId = useMemo(() => uuidv4(), []);
  const chatDataBlockId = useMemo(() => uuidv4(), []);

  return <Room roomId={roomId} gameDataBlockId={gameDataBlockId} chatDataBlockId={chatDataBlockId} />;
};

export default Page;
