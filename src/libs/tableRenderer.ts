'use client';

import { DataBlockId } from '@/libs/dataBlock';
import { DataBlockTableChannel } from '@/libs/dataBlockTable';
import { Maybe } from '@/utils/utilityTypes';

import { Renderer } from './tableRenderer/renderer';
import {
  RunRenderer,
  SetCanvasSize,
  SetDataBlockTablePort,
  SetTableDataBlockId,
  StopRenderer,
} from './tableRenderer/worker/message';

export type TableRendererChannel = {
  worker: Maybe<Worker>;
  renderer: Maybe<Renderer>;
};

export const TableRendererChannel = {
  create(): TableRendererChannel {
    const worker = (() => {
      if (typeof Worker !== 'undefined') {
        return new Worker(new URL('@/libs/tableRenderer/worker.ts', import.meta.url), {
          name: 'tableRenderer',
          type: 'module',
        });
      } else {
        return undefined;
      }
    })();

    return {
      worker,
      renderer: undefined,
    };
  },

  run(context: TableRendererChannel, table: DataBlockTableChannel, roomId: string, canvas: OffscreenCanvas) {
    console.log('run renderer');
    const channel = new MessageChannel();
    DataBlockTableChannel.setPort(table, channel.port1);
    context.worker?.postMessage(RunRenderer.create({ roomId, canvas, port: channel.port2 }), [canvas, channel.port2]);
  },

  stop(context: TableRendererChannel) {
    context.worker?.postMessage(StopRenderer.create({}));
  },

  setCanvasSize(context: TableRendererChannel, [width, height]: [number, number]) {
    context.worker?.postMessage(SetCanvasSize.create({ width, height }));
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
