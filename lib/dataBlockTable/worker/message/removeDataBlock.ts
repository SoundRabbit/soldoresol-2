import { DataBlockId } from '@/lib/dataBlock';

const tagName = 'removeDataBlock';

export type RemoveDataBlock = {
  tag: typeof tagName;
  sessionId: string;
  roomId: string;
  dataBlockId: DataBlockId;
};

export type RemoveDataBlockResponse = {
  tag: typeof tagName;
  sessionId: string;
  roomId: string;
  dataBlockId: DataBlockId | undefined;
};

export const RemoveDataBlock = {
  is: (value: unknown): value is RemoveDataBlock =>
    value instanceof Object && (value as RemoveDataBlock).tag === tagName,

  create: (props: Omit<RemoveDataBlock, 'tag'>): RemoveDataBlock => {
    return { ...props, tag: tagName };
  },
};

export const RemoveDataBlockResponse = {
  is: (value: unknown): value is RemoveDataBlockResponse =>
    value instanceof Object && (value as RemoveDataBlockResponse).tag === tagName,

  create: (props: Omit<RemoveDataBlockResponse, 'tag'>): RemoveDataBlockResponse => {
    return { ...props, tag: tagName };
  },
};
