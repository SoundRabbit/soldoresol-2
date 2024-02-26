import { DataBlock } from '@/libs/dataBlock';

const tagName = 'getDataBlock';

export type GetDataBlock = {
  tag: typeof tagName;
  sessionId: string;
  roomId: string;
  dataBlockId: string;
};

export type GetDataBlockResponse = {
  tag: typeof tagName;
  sessionId: string;
  roomId: string;
  dataBlockId: string;
  dataBlock: DataBlock | undefined;
  updateTimestamp: number;
};

export const GetDataBlock = {
  is: (data: unknown) => data && (data as GetDataBlock).tag === tagName,

  create(payload: Omit<GetDataBlock, 'tag'>): GetDataBlock {
    return { tag: tagName, ...payload };
  },
};

export const GetDataBlockResponse = {
  is: (data: unknown) =>
    data && (data as GetDataBlockResponse).tag === tagName && DataBlock.is((data as GetDataBlockResponse).dataBlock),

  create(payload: Omit<GetDataBlockResponse, 'tag'>): GetDataBlockResponse {
    return { tag: tagName, ...payload };
  },
};
