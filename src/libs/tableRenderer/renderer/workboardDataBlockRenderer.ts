import { DataBlockId } from '@/libs/dataBlock';
import { WorkboardDataBlock } from '@/libs/dataBlock/tableObject/workboardDataBlock';
import { bgColor } from '@/utils/openColor';
import { Maybe } from '@/utils/utilityTypes';

import { GetDataBlock } from './_common';

type AnnotMesh = {
  size: [number, number];
  mesh: BABYLON.Mesh;
  name: string;
  nameCanvas: OffscreenCanvas;
  nameMesh: BABYLON.Mesh;
  nameTexture: BABYLON.DynamicTexture;
};

export type WorkboardDataBlockRenderer = {
  meshTable: Record<DataBlockId, Maybe<AnnotMesh>>;
};

const createMesh = ([w, h]: [number, number], workboardId: DataBlockId) => {
  const lines = [] as BABYLON.Vector3[][];

  for (let x = 0; x <= w; x++) {
    lines.push([new BABYLON.Vector3(x - w * 0.5, 0, -h * 0.5), new BABYLON.Vector3(x - w * 0.5, 0, h * 0.5)]);
  }
  for (let y = 0; y <= h; y++) {
    lines.push([new BABYLON.Vector3(-w * 0.5, 0, y - h * 0.5), new BABYLON.Vector3(w * 0.5, 0, y - h * 0.5)]);
  }

  const mesh = BABYLON.MeshBuilder.CreateLineSystem(workboardId, { lines });
  const color = bgColor.gray[4];
  mesh.color = new BABYLON.Color3(color.red(), color.green(), color.blue());

  return {
    size: [w, h] as [number, number],
    mesh,
  };
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

    if (!annotMesh) {
      const { mesh, size } = createMesh(workboard.size, workboardId);

      const name = workboard.name;

      const nameCanvas = new OffscreenCanvas(64, 64);
      const nameContext = nameCanvas.getContext('2d')!;
      nameContext.font = '48px monospace';
      const textWidth = nameContext!.measureText(name).width + 16;
      nameCanvas.width = textWidth;

      const nameTexture = new BABYLON.DynamicTexture(workboardId + '_nameTex', nameCanvas);
      nameTexture.drawText(name, 8, 56, '48px monospace', 'black', 'white', true, true);

      const nameMaterial = new BABYLON.StandardMaterial(workboardId + '_nameMat');
      nameMaterial.diffuseTexture = nameTexture;
      const nameMesh = BABYLON.MeshBuilder.CreateGround(workboardId + '_nameMesh', {
        height: 1,
        width: 1,
      });
      nameMesh.material = nameMaterial;
      nameMesh.scaling.x = (textWidth / 64) * 0.5;
      nameMesh.scaling.z = 0.5;
      nameMesh.position.x = size[0] / 2 - nameMesh.scaling.x / 2;
      nameMesh.position.z = -size[1] / 2 - nameMesh.scaling.z / 2;

      nameMesh.parent = mesh;

      context.meshTable[workboardId] = {
        size,
        mesh,
        name,
        nameCanvas,
        nameMesh,
        nameTexture,
      };

      scene.addMesh(mesh);
      if (name.length > 0) {
        scene.addMesh(nameMesh);
      }
    } else {
      if (annotMesh.size[0] !== workboard.size[0] || annotMesh.size[1] !== workboard.size[1]) {
        if (annotMesh) {
          scene.removeMesh(annotMesh.mesh);
          annotMesh.mesh.dispose();
        }

        const { mesh, size } = createMesh(workboard.size, workboardId);

        annotMesh.mesh = mesh;
        annotMesh.size = size;
        annotMesh.nameMesh.position.x = size[0] / 2 - annotMesh.nameMesh.scaling.x / 2;
        annotMesh.nameMesh.position.z = -size[1] / 2 - annotMesh.nameMesh.scaling.z / 2;

        scene.addMesh(mesh);
      }
      if (annotMesh.name !== workboard.name) {
        if (workboard.name.length === 0) {
          scene.removeMesh(annotMesh.nameMesh);
        } else {
          const name = workboard.name;
          const nameContext = annotMesh.nameCanvas.getContext('2d')!;
          nameContext.font = '48px monospace';
          const textWidth = nameContext!.measureText(name).width;
          annotMesh.nameCanvas.width = textWidth + 16;
          annotMesh.nameTexture.drawText(name, 8, 56, '48px monospace', 'black', 'white', true, true);
          annotMesh.nameMesh.scaling.x = textWidth / 64;

          if (annotMesh.name.length === 0) {
            scene.addMesh(annotMesh.nameMesh);
          }
        }

        annotMesh.name = workboard.name;
      }
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
