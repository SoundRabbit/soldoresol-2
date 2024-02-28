import { DataBlock, DataBlockId } from '@/lib/dataBlock';

const tagName = 'setDataBlock';

export type SetDataBlock = {
  tag: typeof tagName;
  sessionId: string;
  roomId: string;
  dataBlockId: DataBlockId;
  dataBlock: DataBlock;
};

export type SetDataBlockResponse = {
  tag: typeof tagName;
  sessionId: string;
  roomId: string;
  dataBlockId: DataBlockId | undefined;
};

export const SetDataBlock = {
  is: (value: unknown): value is SetDataBlock => value instanceof Object && (value as SetDataBlock).tag === tagName,

  create: (props: Omit<SetDataBlock, 'tag'>): SetDataBlock => {
    return { ...props, tag: tagName };
  },
};

export const SetDataBlockResponse = {
  is: (value: unknown): value is SetDataBlockResponse =>
    value instanceof Object && (value as SetDataBlockResponse).tag === tagName,

  create: (props: Omit<SetDataBlockResponse, 'tag'>): SetDataBlockResponse => {
    return { ...props, tag: tagName };
  },
};
