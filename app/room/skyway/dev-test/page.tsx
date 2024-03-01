'use client';

import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { RoomView } from '@/component/_room/RoomView';

import { PageProvider } from '../../PageProvider';

const Page = () => {
  const roomId = useMemo(() => {
    return uuidv4();
  }, []);

  return (
    <PageProvider roomId={roomId}>
      <RoomView />
    </PageProvider>
  );
};

export default Page;
