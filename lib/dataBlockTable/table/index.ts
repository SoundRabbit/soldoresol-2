'use client';

import { DataBlock, DataBlockId } from '@/lib/dataBlock';
import { Maybe } from '@/lib/util/utilityTypes';

import { AnnotDataBlock } from './annotDataBlock';

type DataBlockTable = Record<DataBlockId, AnnotDataBlock | undefined>;
type DataBlockTableByRoom = Record<string, DataBlockTable>;

const dataBlockTableByRoom: DataBlockTableByRoom = {};

const getDataBlockTable = (roomId: string): DataBlockTable => {
  if (!dataBlockTableByRoom[roomId]) {
    dataBlockTableByRoom[roomId] = {};
  }
  return dataBlockTableByRoom[roomId];
};

export const getDataBlock = (
  roomId: string,
  dataBlockId: DataBlockId,
): { payload: Maybe<DataBlock>; updateTimestamp: number } => {
  const dataBlockTable = getDataBlockTable(roomId);
  const annotDataBlock = dataBlockTable[dataBlockId];

  return {
    payload: annotDataBlock?.isAvailable ? annotDataBlock.payload : undefined,
    updateTimestamp: annotDataBlock?.updateTimestamp ?? NaN,
  };
};

export const addDataBlock = (roomId: string, dataBlock: DataBlock): Maybe<DataBlockId> => {
  const dataBlockTable = getDataBlockTable(roomId);
  const updateTimestamp = Date.now();

  const insertPosition = dataBlockTable[dataBlock.id];
  const validatedDataBlock =
    !!insertPosition && insertPosition.isAvailable && insertPosition.updateTimestamp > updateTimestamp ?
      { ...dataBlock, id: DataBlockId.create() }
    : dataBlock;
  const annotDataBlock = AnnotDataBlock.from(validatedDataBlock, updateTimestamp, true);

  dataBlockTable[validatedDataBlock.id] = annotDataBlock;

  return validatedDataBlock.id;
};

export const removeDataBlock = (roomId: string, dataBlockId: DataBlockId): Maybe<DataBlockId> => {
  const dataBlockTable = getDataBlockTable(roomId);
  const annotDataBlock = dataBlockTable[dataBlockId];
  const updateTimestamp = Date.now();

  if (annotDataBlock === undefined || annotDataBlock.updateTimestamp > updateTimestamp) return;

  annotDataBlock.isAvailable = false;
  annotDataBlock.updateTimestamp = updateTimestamp;

  return dataBlockId;
};

export const updateDataBlock = (roomId: string, dataBlock: DataBlock): Maybe<DataBlockId> => {
  const dataBlockTable = getDataBlockTable(roomId);
  const annotDataBlock = dataBlockTable[dataBlock.id];
  const updateTimestamp = Date.now();

  if (annotDataBlock === undefined || annotDataBlock.updateTimestamp > updateTimestamp) return;

  annotDataBlock.payload = dataBlock;
  annotDataBlock.isAvailable = true;
  annotDataBlock.updateTimestamp = updateTimestamp;

  return dataBlock.id;
};

export const setDataBlock = (roomId: string, dataBlock: DataBlock): Maybe<DataBlockId> => {
  const dataBlockTable = getDataBlockTable(roomId);

  if (dataBlockTable[dataBlock.id] === undefined) {
    return addDataBlock(roomId, dataBlock);
  } else {
    return updateDataBlock(roomId, dataBlock);
  }
};
