'use client';

import { Maybe } from '@/utils/utilityTypes';

import { Renderer } from './tableRenderer/renderer';
import { RunRenderer, SetCanvasSize, StopRenderer } from './tableRenderer/worker/message';

export type TableRendererChannel = {
  worker: Maybe<Worker>;
  renderer: Maybe<Renderer>;
};

export const TableRendererChannel = {
  create(): TableRendererChannel {
    const worker = (() => {
      if (typeof Worker !== 'undefined') {
        return new Worker(new URL('@/libs/tableRenderer/worker.ts', import.meta.url));
      } else {
        return undefined;
      }
    })();

    return {
      worker,
      renderer: undefined,
    };
  },

  run(context: TableRendererChannel, roomId: string, canvas: OffscreenCanvas) {
    context.worker?.postMessage(RunRenderer.create({ roomId, canvas }), [canvas]);
  },

  stop(context: TableRendererChannel) {
    context.worker?.postMessage(StopRenderer.create({}));
  },

  setCanvasSize(context: TableRendererChannel, [width, height]: [number, number]) {
    context.worker?.postMessage(SetCanvasSize.create({ width, height }));
  },

  terminate(context: TableRendererChannel) {
    context.worker?.terminate();
  },
};
