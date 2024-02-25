'use client';

import { Maybe } from '@/utils/utilityTypes';

import { Renderer } from './renderer';
import { RunRenderer } from './worker/runRenderer';
import { SetCanvasSize } from './worker/setCanvasSize';

const context = {
  renderer: undefined as Maybe<Renderer>,
  canvas: undefined as Maybe<OffscreenCanvas>,
};

if (typeof DedicatedWorkerGlobalScope !== 'undefined' && self instanceof DedicatedWorkerGlobalScope) {
  (self as DedicatedWorkerGlobalScope).addEventListener('message', async (e) => {
    const data = e.data;
    if (RunRenderer.is(data)) {
      context.renderer = Renderer.create(data.roomId, data.canvas);
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
  });
}
