'use client';

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

export type DataBlockTableChannel = {
  worker: Maybe<SharedWorker>;
};

export const DataBlockTableChannel = {
  create(): DataBlockTableChannel {
    const worker = (() => {
      if (typeof SharedWorker !== 'undefined') {
        return new SharedWorker(new URL('@/libs/dataBlockTable/worker.ts', import.meta.url));
      } else {
        return undefined;
      }
    })();

    worker?.port.start();

    return {
      worker,
    };
  },

  async get<T extends DataBlock>(
    context: DataBlockTableChannel,
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
          context.worker?.port.removeEventListener('message', listener);
        }
      };
      context.worker?.port.addEventListener('message', listener);
      context.worker?.port.postMessage(GetDataBlock.create({ roomId, dataBlockId, sessionId }));
    });
  },

  async set<T extends DataBlock>(
    context: DataBlockTableChannel,
    roomId: string,
    dataBlockId: DataBlockId,
    dataBlock: T,
  ): Promise<Maybe<DataBlockId>> {
    return new Promise((resolve, _reject) => {
      const sessionId = uuidv4();
      const listener = (event: MessageEvent) => {
        const data = event.data;
        if (SetDataBlockResponse.is(data) && data.sessionId === sessionId) {
          resolve(data.dataBlockId);
          context.worker?.port.removeEventListener('message', listener);
        }
      };
      context.worker?.port.addEventListener('message', listener);
      context.worker?.port.postMessage(SetDataBlock.create({ roomId, dataBlockId, sessionId, dataBlock }));
    });
  },

  async remove(context: DataBlockTableChannel, roomId: string, dataBlockId: DataBlockId): Promise<Maybe<DataBlockId>> {
    return new Promise((resolve, _reject) => {
      const sessionId = uuidv4();
      const listener = (event: MessageEvent) => {
        const data = event.data;
        if (RemoveDataBlockResponse.is(data) && data.sessionId === sessionId) {
          resolve(data.dataBlockId);
          context.worker?.port.removeEventListener('message', listener);
        }
      };
      context.worker?.port.addEventListener('message', listener);
      context.worker?.port.postMessage(RemoveDataBlock.create({ roomId, dataBlockId, sessionId }));
    });
  },
};
