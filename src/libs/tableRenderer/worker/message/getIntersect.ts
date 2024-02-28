import { DataBlockId } from '@/libs/dataBlock';

const tagName = 'getIntersect';

export type GetIntersect = {
  tag: typeof tagName;
  sessionId: string;
  tableBlockId?: DataBlockId;
  position: [number, number];
};

export type GetIntersectResponse = {
  tag: typeof tagName;
  sessionId: string;
  intersect: {
    tableBlockId?: DataBlockId;
    position: [number, number, number];
  }[];
  camera?: {
    colMajorVp: number[];
    colMajorVpInv: number[];
  };
};

export const GetIntersect = {
  is: (value: unknown): value is GetIntersect =>
    value instanceof Object && value !== null && (value as any).tag === tagName,

  create: (props: Omit<GetIntersect, 'tag'>): GetIntersect => {
    return {
      tag: tagName,
      ...props,
    };
  },
};

export const GetIntersectResponse = {
  is: (value: unknown): value is GetIntersectResponse =>
    value instanceof Object && value !== null && (value as any).tag === tagName,

  create: (props: Omit<GetIntersectResponse, 'tag'>): GetIntersectResponse => {
    return {
      tag: tagName,
      ...props,
    };
  },
};
