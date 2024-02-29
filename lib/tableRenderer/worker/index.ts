import { Maybe } from '@/lib/type/utilityTypes';

import { Renderer } from '../renderer';

import {
  GetIntersect,
  GetIntersectResponse,
  RunRenderer,
  SetCameraPosition,
  SetCanvasSize,
  SetTableDataBlockId,
} from './message';

const context = {
  renderer: undefined as Maybe<Renderer>,
  canvas: undefined as Maybe<OffscreenCanvas>,
};

if (typeof DedicatedWorkerGlobalScope !== 'undefined' && (self as any) instanceof DedicatedWorkerGlobalScope) {
  (self as DedicatedWorkerGlobalScope).addEventListener('message', async (e) => {
    const data = e.data;

    if (GetIntersect.is(data)) {
      if (context.renderer) {
        const intersectList = Renderer.intersectList(context.renderer, data.position, data.tableBlockId);
        let camera = undefined as GetIntersectResponse['camera'];
        if (context.renderer.camera) {
          const viewInv = context.renderer.camera.matrixWorld;
          const projection = context.renderer.camera.projectionMatrix;
          const view = context.renderer.camera.matrixWorldInverse;
          const projectionInv = context.renderer.camera.projectionMatrixInverse;
          const vp = projection.clone().multiply(view);
          const vpInv = viewInv.clone().multiply(projectionInv);
          camera = {
            colMajorVp: vp.elements,
            colMajorVpInv: vpInv.elements,
          };
        }
        self.postMessage(
          GetIntersectResponse.create({
            sessionId: data.sessionId,
            intersect: intersectList,
            camera,
          }),
        );
      } else {
        self.postMessage(GetIntersectResponse.create({ sessionId: data.sessionId, intersect: [] }));
      }
    }
    if (RunRenderer.is(data)) {
      context.renderer = Renderer.create(data.roomId, data.canvas, data.port);
      context.canvas = data.canvas;
      Renderer.run(context.renderer);
    }
    if (SetCameraPosition.is(data)) {
      if (data.position) {
        context.renderer?.camera?.position.set(...data.position);
      }
      if (data.rotation) {
        context.renderer?.camera?.rotation.set(...data.rotation.euler, data.rotation.order);
      }
    }
    if (SetCanvasSize.is(data)) {
      context.renderer?.three.setPixelRatio(data.devicePixelRatio);
      context.renderer?.three.setSize(data.width, data.height, false);
      if (context.renderer?.camera) {
        context.renderer.camera.aspect = data.width / data.height;
        context.renderer.camera.updateProjectionMatrix();
      }
    }
    if (SetTableDataBlockId.is(data)) {
      if (context.renderer) {
        context.renderer.tableDataBlockId = data.tableDataBlockId;
      }
    }
  });
}
