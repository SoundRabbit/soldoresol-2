'use client';

import * as dataBlockTable from './table';
import {
  GetDataBlock,
  GetDataBlockResponse,
  RemoveDataBlock,
  RemoveDataBlockResponse,
  SetDataBlock,
  SetDataBlockResponse,
  SetPort,
} from './worker/message';

if (typeof SharedWorkerGlobalScope !== 'undefined' && self instanceof SharedWorkerGlobalScope) {
  const setListener = (port: MessagePort) => {
    port.onmessage = (e) => {
      const data = e.data;
      if (GetDataBlock.is(data)) {
        const { payload: dataBlock, updateTimestamp } = dataBlockTable.getDataBlock(data.roomId, data.dataBlockId);
        port.postMessage(
          GetDataBlockResponse.create({
            sessionId: data.sessionId,
            roomId: data.roomId,
            dataBlockId: data.dataBlockId,
            dataBlock,
            updateTimestamp,
          }),
        );
      }
      if (RemoveDataBlock.is(data)) {
        const dataBlockId = dataBlockTable.removeDataBlock(data.roomId, data.dataBlockId);
        port.postMessage(
          RemoveDataBlockResponse.create({
            sessionId: data.sessionId,
            roomId: data.roomId,
            dataBlockId: dataBlockId,
          }),
        );
      }
      if (SetDataBlock.is(data)) {
        const dataBlockId = dataBlockTable.setDataBlock(data.roomId, data.dataBlock);
        port.postMessage(
          SetDataBlockResponse.create({ sessionId: data.sessionId, roomId: data.roomId, dataBlockId: dataBlockId }),
        );
      }
      if (SetPort.is(data)) {
        setListener(data.port);
      }
    };
  };

  (self as SharedWorkerGlobalScope).addEventListener('connect', (e) => {
    const port = e.ports[0];
    setListener(port);
    port.start();
  });
}
