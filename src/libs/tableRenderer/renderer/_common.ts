import * as THREE from 'three';

import { DataBlock, DataBlockId } from '@/libs/dataBlock';
import { Maybe } from '@/utils/utilityTypes';

export type GetDataBlock = <T extends DataBlock>(
  dataBlockId: DataBlockId,
  typeChecker: (data: unknown) => data is T,
) => { payload: Maybe<T>; updateTimestamp: number };

export type Rendered = Record<string, Maybe<THREE.Object3D>>;
