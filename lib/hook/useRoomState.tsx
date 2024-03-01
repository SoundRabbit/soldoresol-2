import { useEffect } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { TableRendererChannel } from '../tableRenderer';

const RECOIL_KEY = 'lib/hook/useRoomState:';
const ROOM_ID_STATE_KEY = RECOIL_KEY + 'roomId';
const ROOM_RENDERER_STATE_KEY = RECOIL_KEY + 'roomRenderer';

export type RoomId = string;

const roomIdState = atom<RoomId>({
  key: ROOM_ID_STATE_KEY,
  default: '',
});

const roomRendererState = atom<TableRendererChannel>({
  key: ROOM_RENDERER_STATE_KEY,
  default: TableRendererChannel.$default,
});

export const useRoomIdValue = () => {
  const roomId = useRecoilValue(roomIdState);
  return roomId;
};

export const useSetRoomIdEffect = (roomId: RoomId) => {
  const setRoomId = useSetRecoilState(roomIdState);
  useEffect(() => {
    setRoomId(roomId);
  }, [roomId, setRoomId]);
};

export const useRoomRendererValue = () => {
  const roomRenderer = useRecoilValue(roomRendererState);
  return roomRenderer;
};

export const useSetRoomRendererEffect = () => {
  const setRoomRenderer = useSetRecoilState(roomRendererState);
  useEffect(() => {
    setRoomRenderer((prevRenderer) => {
      prevRenderer.worker?.terminate();
      return TableRendererChannel.create();
    });
  }, [setRoomRenderer]);
};
