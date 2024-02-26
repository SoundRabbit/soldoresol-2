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
  SetPort,
} from './dataBlockTable/worker/message';

export type DataBlockTableChannel = {
  worker: Maybe<SharedWorker>;
  port: Maybe<MessagePort>;
};

export const DataBlockTableChannel = {
  create(port?: MessagePort): DataBlockTableChannel {
    const worker = (() => {
      if (typeof SharedWorker !== 'undefined' && !port) {
        return new SharedWorker(new URL('@/libs/dataBlockTable/worker.ts', import.meta.url), {
          name: 'dataBlockTable',
        });
      } else {
        return undefined;
      }
    })();

    port = port || worker?.port;
    port?.start();

    return {
      worker,
      port,
    };
  },

  async get<T extends DataBlock>(
    context: DataBlockTableChannel,
    roomId: string,
    dataBlockId: DataBlockId,
    typeChecker: (data: DataBlock) => data is T,
  ): Promise<Maybe<T>> {
    const { dataBlock } = await DataBlockTableChannel.getWithTimestamp(context, roomId, dataBlockId, typeChecker);
    return dataBlock;
  },

  async getWithTimestamp<T extends DataBlock>(
    context: DataBlockTableChannel,
    roomId: string,
    dataBlockId: DataBlockId,
    typeChecker: (data: DataBlock) => data is T,
  ): Promise<{ dataBlock: Maybe<T>; updateTimestamp: number }> {
    return new Promise((resolve, _reject) => {
      const sessionId = uuidv4();
      const listener = (event: MessageEvent) => {
        const data = event.data;
        if (GetDataBlockResponse.is(data) && data.sessionId === sessionId) {
          if (data.dataBlock !== undefined && typeChecker(data.dataBlock)) {
            resolve({ dataBlock: data.dataBlock, updateTimestamp: data.updateTimestamp });
          } else {
            resolve({ dataBlock: undefined, updateTimestamp: data.updateTimestamp });
          }
          context.port?.removeEventListener('message', listener);
        }
      };
      context.port?.addEventListener('message', listener);
      context.port?.postMessage(GetDataBlock.create({ roomId, dataBlockId, sessionId }));
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
          context.port?.removeEventListener('message', listener);
        }
      };
      context.port?.addEventListener('message', listener);
      context.port?.postMessage(SetDataBlock.create({ roomId, dataBlockId, sessionId, dataBlock }));
    });
  },

  async remove(context: DataBlockTableChannel, roomId: string, dataBlockId: DataBlockId): Promise<Maybe<DataBlockId>> {
    return new Promise((resolve, _reject) => {
      const sessionId = uuidv4();
      const listener = (event: MessageEvent) => {
        const data = event.data;
        if (RemoveDataBlockResponse.is(data) && data.sessionId === sessionId) {
          resolve(data.dataBlockId);
          context.port?.removeEventListener('message', listener);
        }
      };
      context.port?.addEventListener('message', listener);
      context.port?.postMessage(RemoveDataBlock.create({ roomId, dataBlockId, sessionId }));
    });
  },

  setPort(context: DataBlockTableChannel, port: MessagePort) {
    context.worker?.port.postMessage(SetPort.create({ port }), [port]);
  },
};
