import { EulerOrder } from 'three';
import { v4 as uuidv4 } from 'uuid';

import { DataBlockId } from '@/lib/dataBlock';
import { DataBlockTableChannel } from '@/lib/dataBlockTable';
import { Maybe } from '@/lib/type/utilityTypes';

import {
  GetIntersect,
  GetIntersectResponse,
  RunRenderer,
  SetCameraPosition,
  SetCanvasSize,
  SetDataBlockTablePort,
  SetTableDataBlockId,
  StopRenderer,
} from './worker/message';

export type TableRendererChannel = {
  worker: Maybe<Worker>;
};

export const TableRendererChannel = {
  $default: {
    worker: undefined,
  },

  create(): TableRendererChannel {
    const worker = (() => {
      if (typeof Worker !== 'undefined') {
        return new Worker(new URL('@/lib/tableRenderer/worker/index.ts', import.meta.url), {
          name: 'tableRenderer',
          type: 'module',
        });
      } else {
        return undefined;
      }
    })();

    return {
      worker,
    };
  },

  run(context: TableRendererChannel, table: DataBlockTableChannel, roomId: string, canvas: OffscreenCanvas) {
    const channel = new MessageChannel();
    DataBlockTableChannel.setPort(table, channel.port1);
    context.worker?.postMessage(RunRenderer.create({ roomId, canvas, port: channel.port2 }), [canvas, channel.port2]);
  },

  stop(context: TableRendererChannel) {
    context.worker?.postMessage(StopRenderer.create({}));
  },

  getIntersect(
    context: TableRendererChannel,
    position: [number, number],
    tableDataBlockId?: DataBlockId,
  ): Promise<Pick<GetIntersectResponse, 'camera' | 'intersect'>> {
    return new Promise((resolve) => {
      const sessionId = uuidv4();
      const listener = (e: MessageEvent) => {
        const data = e.data;
        if (GetIntersectResponse.is(data) && data.sessionId === sessionId) {
          context.worker?.removeEventListener('message', listener);
          resolve({ intersect: data.intersect, camera: data.camera });
        }
      };
      context.worker?.addEventListener('message', listener);
      context.worker?.postMessage(GetIntersect.create({ sessionId, position, tableBlockId: tableDataBlockId }));
    });
  },

  setCameraPosition(
    context: TableRendererChannel,
    props: { position?: [number, number, number]; rotation?: { euler: [number, number, number]; order: EulerOrder } },
  ) {
    context.worker?.postMessage(SetCameraPosition.create({ ...props }));
  },

  setCanvasSize(context: TableRendererChannel, [width, height]: [number, number], devicePixelRatio?: number) {
    devicePixelRatio = devicePixelRatio ?? typeof Window !== 'undefined' ? window.devicePixelRatio : 1;
    context.worker?.postMessage(SetCanvasSize.create({ width, height, devicePixelRatio }));
  },

  setDataBlockTablePort(context: TableRendererChannel, port: MessagePort) {
    context.worker?.postMessage(SetDataBlockTablePort.create({ port }));
  },

  setTableDataBlockId(context: TableRendererChannel, tableDataBlockId: DataBlockId) {
    context.worker?.postMessage(SetTableDataBlockId.create({ tableDataBlockId }));
  },

  terminate(context: TableRendererChannel) {
    context.worker?.terminate();
  },
};
