'use client';

import { DataBlock, DataBlockId } from '@/libs/dataBlock';
import { TableDataBlock } from '@/libs/dataBlock/gameObject/tableDataBlock';
import { DataBlockTableChannel } from '@/libs/dataBlockTable';
import { Maybe } from '@/utils/utilityTypes';

importScripts('https://cdn.babylonjs.com/babylon.js');

type BABYLON = typeof import('babylonjs');

export type Renderer = {
  dataBlockTable: DataBlockTableChannel;
  engine: BABYLON.Engine;
  scene: Maybe<BABYLON.Scene>; //最終的には、テーブルごとにシーンを作成する
  roomId: string;
  tableDataBlockId: DataBlockId;
  dataBlockChache: Record<DataBlockId, Maybe<AnnotDataBlock>>;
};

type AnnotDataBlock = {
  payload: Maybe<DataBlock>;
  isChached: boolean;
};

export const Renderer = {
  create(
    roomId: string,
    canvas: BABYLON.Nullable<HTMLCanvasElement | OffscreenCanvas | WebGLRenderingContext | WebGL2RenderingContext>,
  ): Renderer {
    const dataBlockTable = DataBlockTableChannel.create();
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

    return {
      dataBlockTable,
      engine,
      scene: undefined,
      roomId,
      tableDataBlockId: DataBlockId.none,
      dataBlockChache: {},
    };
  },

  run(context: Renderer) {
    context.engine?.runRenderLoop(() => render(context));
  },

  stop(context: Renderer) {
    context.engine?.stopRenderLoop();
  },
};

const getDataBlock = <T extends DataBlock>(
  context: Renderer,
  dataBlockId: DataBlockId,
  typeChecker: (data: unknown) => data is T,
) => {
  if (context.dataBlockChache[dataBlockId]?.isChached) {
    return context.dataBlockChache[dataBlockId]!.payload;
  }

  if (context.dataBlockChache[dataBlockId]) {
    context.dataBlockChache[dataBlockId]!.isChached = true;
  } else {
    context.dataBlockChache[dataBlockId] = { isChached: true, payload: undefined };
  }

  DataBlockTableChannel.get(context.dataBlockTable, context.roomId, dataBlockId, typeChecker).then((dataBlock) => {
    context.dataBlockChache[dataBlockId] = { isChached: true, payload: dataBlock };
  });

  return context.dataBlockChache[dataBlockId]!.payload;
};

const render = (context: Renderer) => {
  const tableDataBlock = getDataBlock(context, context.tableDataBlockId, TableDataBlock.partialIs);

  if (context.scene === undefined) {
    const scene = new BABYLON.Scene(context.engine);
    const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, scene);
    sphere.position.y = 1;
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);

    context.scene = scene;
  }

  context.scene!.clearColor = new BABYLON.Color4(0, 0, 0, 1);
  context.scene!.render();
};
