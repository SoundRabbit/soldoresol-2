import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { RoomProvider } from '@/component/_room/RoomProvider';
import { RoomView } from '@/component/_room/RoomView';

type PageProps = {
  params: {
    roomId: string;
  };
};

const Page = ({ params: { roomId } }: PageProps) => {
  const gameDataBlockId = useMemo(() => uuidv4(), []);
  const chatDataBlockId = useMemo(() => uuidv4(), []);

  return (
    <RoomProvider roomId={roomId}>
      <RoomView gameDataBlockId={gameDataBlockId} chatDataBlockId={chatDataBlockId} />
    </RoomProvider>
  );
};

export default Page;
