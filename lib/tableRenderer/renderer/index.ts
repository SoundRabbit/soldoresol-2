import * as THREE from 'three';

import { DataBlock, DataBlockId } from '@/lib/dataBlock';
import { TableDataBlock } from '@/lib/dataBlock/gameObject/tableDataBlock';
import { DataBlockTableChannel } from '@/lib/dataBlockTable';
import { Maybe } from '@/lib/type/utilityTypes';

import { Camera } from '../camera';

import { Rendered } from './_common';
import { WorkboardDataBlockRenderer } from './workboardDataBlockRenderer';

type AnnotDataBlock = {
  payload: Maybe<DataBlock>;
  isCached: boolean;
  updateTimestamp: number;
};

type DataBlockCache = Record<DataBlockId, Maybe<AnnotDataBlock>>;

type TableScene = {
  scene: THREE.Scene;
  rendered: Rendered;
};

export type Renderer = {
  dataBlockTable: DataBlockTableChannel;
  three: THREE.WebGLRenderer;
  isRunning: boolean;

  roomId: string;
  tableDataBlockId: DataBlockId;
  dataBlockCache: DataBlockCache;

  camera: Maybe<THREE.PerspectiveCamera>;
  rayCaster: THREE.Raycaster;
  tableScene: Record<DataBlockId, Maybe<TableScene>>;
  workboardDataBlockRenderer: WorkboardDataBlockRenderer;
};

const reasetCacheMark = (context: Renderer) => {
  const keys = Object.keys(context.dataBlockCache);
  for (const key of keys) {
    context.dataBlockCache[key]!.isCached = false;
  }
};

const getDataBlock = <T extends DataBlock>(
  context: Renderer,
  dataBlockId: DataBlockId,
  typeChecker: (data: unknown) => data is T,
): {
  payload: Maybe<T>;
  updateTimestamp: number;
} => {
  if (context.dataBlockCache[dataBlockId]?.isCached) {
    const { payload, updateTimestamp } = context.dataBlockCache[dataBlockId]!;
    if (typeChecker(payload)) {
      return { payload, updateTimestamp };
    } else {
      return { payload: undefined, updateTimestamp: 0 };
    }
  }

  if (context.dataBlockCache[dataBlockId]) {
    context.dataBlockCache[dataBlockId]!.isCached = true;
  } else {
    context.dataBlockCache[dataBlockId] = { isCached: true, payload: undefined, updateTimestamp: 0 };
  }

  DataBlockTableChannel.getWithTimestamp(context.dataBlockTable, context.roomId, dataBlockId, typeChecker).then(
    ({ dataBlock, updateTimestamp }) => {
      context.dataBlockCache[dataBlockId] = {
        isCached: true,
        payload: dataBlock,
        updateTimestamp: isNaN(updateTimestamp) ? 0 : updateTimestamp,
      };
    },
  );

  const { payload, updateTimestamp } = context.dataBlockCache[dataBlockId]!;
  if (typeChecker(payload)) {
    return { payload, updateTimestamp };
  } else {
    return { payload: undefined, updateTimestamp: 0 };
  }
};

const renderScene = (context: Renderer, tableDataBlockId: DataBlockId) => {
  if (tableDataBlockId === DataBlockId.none) return;

  reasetCacheMark(context);

  const rendered = {} as Rendered;

  if (!context.camera) {
    const size = new THREE.Vector2();
    context.three.getSize(size);
    const camera = new THREE.PerspectiveCamera(75, size.x / size.y, 0.1, 1000);
    camera.position.set(Camera.initialPosition.x, Camera.initialPosition.y, Camera.initialPosition.z);
    camera.rotation.set(Camera.initialRotation.x, Camera.initialRotation.y, Camera.initialRotation.z);
    camera.rotation.order = Camera.initialRotation.order;
    context.camera = camera;
  }

  if (!context.tableScene[tableDataBlockId]) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    context.tableScene[tableDataBlockId] = {
      scene,
      rendered: {},
    };
  }

  const scene = context.tableScene[tableDataBlockId]!.scene;

  const { payload: tableDataBlock } = getDataBlock(context, tableDataBlockId, TableDataBlock.partialIs);

  if (tableDataBlock) {
    const workboardDataBlockIdList = tableDataBlock.workboardList;
    WorkboardDataBlockRenderer.render(
      context.workboardDataBlockRenderer,
      rendered,
      (dataBlockId, typeChecker) => getDataBlock(context, dataBlockId, typeChecker),
      workboardDataBlockIdList,
      scene,
    );
  }

  for (const [id, sceneObject] of Object.entries(context.tableScene[tableDataBlockId]!.rendered)) {
    if (!rendered[id] && sceneObject) {
      scene.remove(sceneObject);
    }
  }
  context.tableScene[tableDataBlockId]!.rendered = rendered;
};

export const Renderer = {
  create(roomId: string, canvas: HTMLCanvasElement | OffscreenCanvas, port?: MessagePort): Renderer {
    const dataBlockTable = DataBlockTableChannel.create(port);
    const antiAliasing = false;
    const three = new THREE.WebGLRenderer({ canvas, antialias: antiAliasing });

    return {
      dataBlockTable,
      three,
      isRunning: false,
      roomId,
      tableDataBlockId: DataBlockId.none,
      dataBlockCache: {},
      camera: undefined,
      rayCaster: new THREE.Raycaster(),
      tableScene: {},
      workboardDataBlockRenderer: WorkboardDataBlockRenderer.create(),
    };
  },

  run(context: Renderer) {
    const renderLoop = () => {
      if (context.isRunning === false) return;

      requestAnimationFrame(renderLoop);

      const tableDataBlockId = context.tableDataBlockId;
      if (tableDataBlockId === DataBlockId.none) return;

      renderScene(context, tableDataBlockId);
      if (context.camera && context.tableScene[tableDataBlockId]) {
        context.three.render(context.tableScene[tableDataBlockId]!.scene, context.camera);
      }
    };

    context.isRunning = true;
    requestAnimationFrame(renderLoop);
  },

  stop(context: Renderer) {
    context.isRunning = false;
  },

  intersectList(
    context: Renderer,
    position: [number, number],
    tableDataBlockId?: DataBlockId,
  ): { dataBlockId?: DataBlockId; position: [number, number, number] }[] {
    const tableScene = context.tableScene[tableDataBlockId ?? context.tableDataBlockId];
    if (!tableScene) return [];

    const camera = context.camera;
    if (!camera) return [];

    const mouse = new THREE.Vector2(...position);
    const rayCaster = context.rayCaster;
    rayCaster.setFromCamera(mouse, camera);

    const intersectDataBlockIdList = [] as { dataBlockId?: DataBlockId; position: [number, number, number] }[];
    const intersectObjectList = rayCaster.intersectObjects(tableScene.scene.children, true);
    const alreadyIntersectDataBlockIdSet = new Set<DataBlockId>();
    for (const intersectObject of intersectObjectList) {
      if (intersectObject.object.userData.dataBlockId) {
        const dataBlockId =
          typeof intersectObject.object.userData.dataBlockId === 'string' ?
            intersectObject.object.userData.dataBlockId
          : undefined;

        if (dataBlockId) {
          if (alreadyIntersectDataBlockIdSet.has(dataBlockId)) {
            continue;
          }
          alreadyIntersectDataBlockIdSet.add(dataBlockId);
        }

        intersectDataBlockIdList.push({
          dataBlockId,
          position: [intersectObject.point.x, intersectObject.point.y, intersectObject.point.z],
        });
      }
    }

    return intersectDataBlockIdList;
  },
};
