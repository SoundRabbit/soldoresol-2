'use client';

import { DataBlock, DataBlockId } from '@/libs/dataBlock';
import { TableDataBlock } from '@/libs/dataBlock/gameObject/tableDataBlock';
import { DataBlockTableChannel } from '@/libs/dataBlockTable';
import { Maybe } from '@/utils/utilityTypes';

import { WorkboardDataBlockRenderer } from './renderer/workboardDataBlockRenderer';

importScripts('https://cdn.babylonjs.com/babylon.js');

type BABYLON = typeof import('babylonjs');

type AnnotDataBlock = {
  payload: Maybe<DataBlock>;
  isCached: boolean;
  updateTimestamp: number;
};

type DataBlockCache = Record<DataBlockId, Maybe<AnnotDataBlock>>;

export type Renderer = {
  dataBlockTable: DataBlockTableChannel;
  engine: BABYLON.Engine;

  roomId: string;
  tableDataBlockId: DataBlockId;
  dataBlockCache: DataBlockCache;
  rendered: Set<DataBlockId>;

  camera: Maybe<BABYLON.FreeCamera>;
  tableScene: Record<DataBlockId, Maybe<BABYLON.Scene>>;
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

  const rendered = new Set<DataBlockId>();

  if (!context.tableScene[tableDataBlockId]) {
    const scene = new BABYLON.Scene(context.engine);

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0));
    light.intensity = 0.7;
    if (!context.camera) {
      const camera = new BABYLON.FreeCamera('mainCamera', new BABYLON.Vector3(5, 15, -15));
      camera.setTarget(BABYLON.Vector3.Zero());
      context.camera = camera;
    }
    scene.addCamera(context.camera);
    scene.addLight(light);
    scene.activeCamera = context.camera;

    context.tableScene[tableDataBlockId] = scene;
  }

  const scene = context.tableScene[tableDataBlockId]!;

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
};

export const Renderer = {
  create(
    roomId: string,
    canvas: BABYLON.Nullable<HTMLCanvasElement | OffscreenCanvas | WebGLRenderingContext | WebGL2RenderingContext>,
    port?: MessagePort,
  ): Renderer {
    const dataBlockTable = DataBlockTableChannel.create(port);
    const antiAliasing = false;
    const engine = new BABYLON.Engine(canvas, antiAliasing, { preserveDrawingBuffer: true, stencil: true });

    return {
      dataBlockTable,
      engine,
      tableDataBlockId: DataBlockId.none,
      roomId,
      dataBlockCache: {},
      rendered: new Set(),
      camera: undefined,
      tableScene: {},
      workboardDataBlockRenderer: WorkboardDataBlockRenderer.create(),
    };
  },

  run(context: Renderer) {
    context.engine?.runRenderLoop(() => {
      const tableDataBlockId = context.tableDataBlockId;
      if (tableDataBlockId === DataBlockId.none) return;

      renderScene(context, tableDataBlockId);
      context.tableScene[tableDataBlockId]?.render();
    });
  },

  stop(context: Renderer) {
    context.engine?.stopRenderLoop();
  },
};
