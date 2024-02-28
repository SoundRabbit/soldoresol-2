'use client';

import * as THREE from 'three';

import { DataBlockId } from '@/libs/dataBlock';
import { WorkboardDataBlock } from '@/libs/dataBlock/tableObject/workboardDataBlock';
import { bgColor, txColor } from '@/utils/openColor';
import { Maybe } from '@/utils/utilityTypes';

import { GetDataBlock, Rendered } from './_common';

type AnnotMesh = {
  size: [number, number];
  mesh: THREE.LineSegments;
  name: string;
  nameCanvas: OffscreenCanvas;
  nameMesh: THREE.Mesh;
  nameTexture: THREE.CanvasTexture;
};

type GeometryTable = Record<string, Maybe<THREE.BufferGeometry>>;

export type WorkboardDataBlockRenderer = {
  meshTable: Record<DataBlockId, Maybe<AnnotMesh>>;
  geometryTable: GeometryTable;
};

const sizeString = (size: [number, number]) => `${Math.round(size[0])},${Math.round(size[1])}`;

const getGeometry = (geometryTable: GeometryTable, size: [number, number]) => {
  const w = Math.round(size[0]);
  const h = Math.round(size[1]);
  const key = sizeString([w, h]);
  if (geometryTable[key]) {
    return {
      geom: geometryTable[key]!,
      size: [w, h] as [number, number],
    };
  }

  const lines = [] as THREE.Vector3[][];

  for (let x = 0; x <= w; x++) {
    lines.push([new THREE.Vector3(x - w * 0.5, -h * 0.5, 0), new THREE.Vector3(x - w * 0.5, h * 0.5, 0)]);
  }
  for (let y = 0; y <= h; y++) {
    lines.push([new THREE.Vector3(-w * 0.5, y - h * 0.5, 0), new THREE.Vector3(w * 0.5, y - h * 0.5, 0)]);
  }

  const geom = new THREE.BufferGeometry().setFromPoints(lines.flat());

  return {
    size: [w, h] as [number, number],
    geom,
  };
};

const render = (
  context: WorkboardDataBlockRenderer,
  rendered: Rendered,
  getDataBlock: GetDataBlock,
  workboardDataBlockIdList: DataBlockId[],
  scene: THREE.Scene,
) => {
  for (const workboardId of workboardDataBlockIdList) {
    const { payload: workboard } = getDataBlock(workboardId, WorkboardDataBlock.partialIs);
    if (!workboard) {
      continue;
    }

    const annotMesh = context.meshTable[workboardId];

    if (!annotMesh) {
      const { geom, size } = getGeometry(context.geometryTable, workboard.size);
      const mesh = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({ color: bgColor.gray[4].rgbNumber() }));
      mesh.userData = { dataBlockId: workboardId };

      const name = workboard.name;

      const canvasHeight = 128;
      const canvasFont = `${canvasHeight - 8 * 2}px monospace`;

      const nameCanvas = new OffscreenCanvas(canvasHeight, canvasHeight);
      const nameContext = nameCanvas.getContext('2d')!;
      nameContext.font = canvasFont;
      const canvasWidth = nameContext.measureText(name).width + 8 * 2;
      nameCanvas.width = canvasWidth;

      nameContext.fillStyle = bgColor.gray[0].hex();
      nameContext.fillRect(0, 0, nameCanvas.width, nameCanvas.height);
      nameContext.font = canvasFont;
      nameContext.fillStyle = txColor.gray[4].hex();
      nameContext.fillText(name, 8, canvasHeight - 8 * 2);

      const nameTexture = new THREE.CanvasTexture(nameCanvas);

      const nameMaterial = new THREE.MeshBasicMaterial({ map: nameTexture });
      const nameMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), nameMaterial);
      nameMesh.userData = { dataBlockId: workboardId };
      const hScale = 0.5;
      nameMesh.scale.x = (canvasWidth / canvasHeight) * hScale;
      nameMesh.scale.y = hScale;
      nameMesh.position.x = size[0] / 2 - nameMesh.scale.x / 2;
      nameMesh.position.y = -size[1] / 2 - nameMesh.scale.y / 2;

      nameMesh.parent = mesh;

      context.meshTable[workboardId] = {
        size,
        mesh,
        name,
        nameCanvas,
        nameMesh,
        nameTexture,
      };

      scene.add(mesh);
      scene.add(nameMesh);
    } else {
      if (annotMesh.size[0] !== workboard.size[0] || annotMesh.size[1] !== workboard.size[1]) {
        const { geom, size } = getGeometry(context.geometryTable, workboard.size);

        annotMesh.mesh.geometry = geom;
        annotMesh.size = size;
        annotMesh.nameMesh.position.x = size[0] / 2 - annotMesh.nameMesh.scale.x / 2;
        annotMesh.nameMesh.position.z = size[1] / 2 - annotMesh.nameMesh.scale.z / 2;
      }
      if (annotMesh.name !== workboard.name) {
        const name = workboard.name;

        const canvasHeight = annotMesh.nameCanvas.height;
        const canvasFont = `${canvasHeight - 8 * 2}px monospace`;

        const nameCanvas = annotMesh.nameCanvas;
        const nameContext = nameCanvas.getContext('2d')!;
        nameContext.font = '48px monospace';
        const textWidth = nameContext.measureText(name).width;
        nameCanvas.width = textWidth + 16;

        nameContext.fillStyle = bgColor.gray[0].hex();
        nameContext.fillRect(0, 0, nameCanvas.width, nameCanvas.height);
        nameContext.font = canvasFont;
        nameContext.fillStyle = txColor.gray[4].hex();
        nameContext.fillText(name, 8, canvasHeight - 8 * 2);

        annotMesh.nameTexture.needsUpdate = true;

        annotMesh.nameMesh.scale.x = (textWidth / 64) * annotMesh.nameMesh.scale.z;
        annotMesh.nameMesh.position.x = annotMesh.size[0] / 2 - annotMesh.nameMesh.scale.x / 2;
        annotMesh.nameMesh.position.y = -annotMesh.size[1] / 2 - annotMesh.nameMesh.scale.z / 2;

        annotMesh.name = workboard.name;
      }
    }

    const { mesh, nameMesh } = context.meshTable[workboardId]!;
    rendered[mesh.uuid] = mesh;
    rendered[nameMesh.uuid] = nameMesh;
  }
};

export const WorkboardDataBlockRenderer = {
  create(): WorkboardDataBlockRenderer {
    return { meshTable: {}, geometryTable: {} };
  },
  render,
};
