import { v4 as uuidv4 } from 'uuid';

import { DataBlock, DataBlockId } from '@/libs/dataBlock';
import { Maybe } from '@/utils/utilityTypes';

import {
  GetDataBlock,
  GetDataBlockResponse,
  RemoveDataBlock,
  RemoveDataBlockResponse,
  SetDataBlock,
  SetDataBlockResponse,
} from './dataBlockTable/worker/message';

export class DataBlockTableChannel {
  worker: Maybe<SharedWorker>;

  constructor() {
    if (typeof SharedWorker !== 'undefined') {
      this.worker = new SharedWorker(new URL('@/libs/dataBlockTable/worker.ts', import.meta.url));
      this.worker.port.start();
    }
  }

  async get<T extends DataBlock>(
    roomId: string,
    dataBlockId: DataBlockId,
    typeChecker: (data: DataBlock) => data is T,
  ): Promise<Maybe<T>> {
    return new Promise((resolve, _reject) => {
      const sessionId = uuidv4();
      const listener = (event: MessageEvent) => {
        const data = event.data;
        if (GetDataBlockResponse.is(data) && data.sessionId === sessionId) {
          if (data.dataBlock !== undefined && typeChecker(data.dataBlock)) {
            resolve(data.dataBlock);
          } else {
            resolve(undefined);
          }
          this.worker?.port.removeEventListener('message', listener);
        }
      };
      this.worker?.port.addEventListener('message', listener.bind(this));
      this.worker?.port.postMessage(GetDataBlock.create({ roomId, dataBlockId, sessionId }));
    });
  }

  async set<T extends DataBlock>(roomId: string, dataBlockId: DataBlockId, dataBlock: T): Promise<Maybe<DataBlockId>> {
    return new Promise((resolve, _reject) => {
      const sessionId = uuidv4();
      const listener = (event: MessageEvent) => {
        const data = event.data;
        if (SetDataBlockResponse.is(data) && data.sessionId === sessionId) {
          resolve(data.dataBlockId);
          this.worker?.port.removeEventListener('message', listener);
        }
      };
      this.worker?.port.addEventListener('message', listener.bind(this));
      this.worker?.port.postMessage(SetDataBlock.create({ roomId, dataBlockId, sessionId, dataBlock }));
      this.worker?.port.start();
    });
  }

  async remove(roomId: string, dataBlockId: DataBlockId): Promise<Maybe<DataBlockId>> {
    return new Promise((resolve, _reject) => {
      const sessionId = uuidv4();
      const listener = (event: MessageEvent) => {
        const data = event.data;
        if (RemoveDataBlockResponse.is(data) && data.sessionId === sessionId) {
          resolve(data.dataBlockId);
          this.worker?.port.removeEventListener('message', listener);
        }
      };
      this.worker?.port.addEventListener('message', listener.bind(this));
      this.worker?.port.postMessage(RemoveDataBlock.create({ roomId, dataBlockId, sessionId }));
      this.worker?.port.start();
    });
  }
}
