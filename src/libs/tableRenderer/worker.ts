'use client';

import { Maybe } from '@/utils/utilityTypes';

import { Renderer } from './renderer';
import { RunRenderer, SetCanvasSize, SetTableDataBlockId } from './worker/message';

const context = {
  renderer: undefined as Maybe<Renderer>,
  canvas: undefined as Maybe<OffscreenCanvas>,
};

if (typeof DedicatedWorkerGlobalScope !== 'undefined' && self instanceof DedicatedWorkerGlobalScope) {
  (self as DedicatedWorkerGlobalScope).addEventListener('message', async (e) => {
    const data = e.data;
    if (RunRenderer.is(data)) {
      context.renderer = Renderer.create(data.roomId, data.canvas, data.port);
      context.canvas = data.canvas;
      Renderer.run(context.renderer);
    }
    if (SetCanvasSize.is(data)) {
      if (context.canvas) {
        context.canvas.width = data.width;
        context.canvas.height = data.height;
      }
      context.renderer?.engine.resize();
    }
    if (SetTableDataBlockId.is(data)) {
      if (context.renderer) {
        context.renderer.tableDataBlockId = data.tableDataBlockId;
      }
    }
  });
}
