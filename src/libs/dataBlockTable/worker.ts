'use client';

import * as dataBlockTable from './worker/dataBlockTable';
import {
  GetDataBlock,
  GetDataBlockResponse,
  RemoveDataBlock,
  RemoveDataBlockResponse,
  SetDataBlock,
  SetDataBlockResponse,
} from './worker/message';

if (typeof SharedWorkerGlobalScope !== 'undefined' && self instanceof SharedWorkerGlobalScope) {
  (self as SharedWorkerGlobalScope).addEventListener('connect', (e) => {
    const port = e.ports[0];
    port.onmessage = (e) => {
      const data = e.data;
      if (GetDataBlock.is(data)) {
        const dataBlock = dataBlockTable.getDataBlock(data.roomId, data.dataBlockId);
        port.postMessage(
          GetDataBlockResponse.create({
            sessionId: data.sessionId,
            roomId: data.roomId,
            dataBlockId: data.dataBlockId,
            dataBlock: dataBlock,
          }),
        );
      } else if (SetDataBlock.is(data)) {
        const dataBlockId = dataBlockTable.setDataBlock(data.roomId, data.dataBlock);
        port.postMessage(
          SetDataBlockResponse.create({ sessionId: data.sessionId, roomId: data.roomId, dataBlockId: dataBlockId }),
        );
      } else if (RemoveDataBlock.is(data)) {
        const dataBlockId = dataBlockTable.removeDataBlock(data.roomId, data.dataBlockId);
        port.postMessage(
          RemoveDataBlockResponse.create({
            sessionId: data.sessionId,
            roomId: data.roomId,
            dataBlockId: dataBlockId,
          }),
        );
      }
    };
    port.start();
  });
}
