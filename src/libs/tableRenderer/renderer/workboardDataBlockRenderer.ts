import { DataBlockId } from '@/libs/dataBlock';
import { WorkboardDataBlock } from '@/libs/dataBlock/tableObject/workboardDataBlock';
import { Maybe } from '@/utils/utilityTypes';

import { GetDataBlock } from './_common';

type RenderedDataBlock = {
  updateTimestamp: number;
};

type AnnotMesh = {
  size: [number, number];
  mesh: BABYLON.LinesMesh;
};

export type WorkboardDataBlockRenderer = {
  meshTable: Record<DataBlockId, Maybe<AnnotMesh>>;
};

const render = (
  context: WorkboardDataBlockRenderer,
  rendered: Set<DataBlockId>,
  getDataBlock: GetDataBlock,
  workboardDataBlockIdList: DataBlockId[],
  scene: BABYLON.Scene,
) => {
  for (const workboardId of workboardDataBlockIdList) {
    const { payload: workboard } = getDataBlock(workboardId, WorkboardDataBlock.partialIs);
    if (!workboard) {
      continue;
    }

    const annotMesh = context.meshTable[workboardId];

    if (!annotMesh || annotMesh.size[0] !== workboard.size[0] || annotMesh.size[1] !== workboard.size[1]) {
      if (annotMesh) {
        scene.removeMesh(annotMesh.mesh);
        annotMesh.mesh.dispose();
      }

      console.log('rebuild workboard', workboardId, workboard.size[0], workboard.size[1]);

      const w = workboard.size[0];
      const h = workboard.size[1];
      const lines = [] as BABYLON.Vector3[][];

      for (let x = 0; x <= w; x++) {
        lines.push([new BABYLON.Vector3(x - w * 0.5, -h * 0.5, 0), new BABYLON.Vector3(x - w * 0.5, h * 0.5, 0)]);
      }
      for (let y = 0; y <= h; y++) {
        lines.push([new BABYLON.Vector3(-w * 0.5, y - h * 0.5, 0), new BABYLON.Vector3(w * 0.5, y - h * 0.5, 0)]);
      }

      const mesh = BABYLON.MeshBuilder.CreateLineSystem(workboardId, { lines });

      context.meshTable[workboardId] = { size: workboard.size, mesh: mesh };
      scene.addMesh(mesh);
    }

    rendered.add(workboardId);
  }
};

export const WorkboardDataBlockRenderer = {
  create(): WorkboardDataBlockRenderer {
    return { meshTable: {} };
  },
  render,
};
