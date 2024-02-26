import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Room } from '@/component/Room';

const RoomPage = () => {
  const gameDataBlockId = useMemo(() => uuidv4(), []);
  const chatDataBlockId = useMemo(() => uuidv4(), []);

  return <Room gameDataBlockId={gameDataBlockId} chatDataBlockId={chatDataBlockId} />;
};

export default RoomPage;
