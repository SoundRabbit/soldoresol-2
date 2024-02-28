import { DataBlockId } from '@/lib/dataBlock';

const tagName = 'setTableDataBlockId';

export type SetTableDataBlockId = {
  tag: typeof tagName;
  tableDataBlockId: DataBlockId;
};

export const SetTableDataBlockId = {
  is: (value: unknown): value is SetTableDataBlockId =>
    value instanceof Object && value !== null && (value as any).tag === tagName,

  create(props: Omit<SetTableDataBlockId, 'tag'>): SetTableDataBlockId {
    return {
      tag: tagName,
      ...props,
    };
  },
};
