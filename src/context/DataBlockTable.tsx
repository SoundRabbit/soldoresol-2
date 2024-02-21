import React, { MutableRefObject, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { DataBlockId } from '@/dataBlock';

import { AnnotDataBlock } from './DataBlockTable/annotDataBlock';

export type DataBlockTable = Record<DataBlockId, AnnotDataBlock | undefined>;

export type AnnotDataBlockTable = {
  payload: DataBlockTable;
  id: string;
  getKeyList: ((index: number) => any)[];
};

export const DataBlockTableContext = React.createContext<MutableRefObject<AnnotDataBlockTable> | undefined>(undefined);

export type DataBlockTableProviderProps = {
  children?: React.ReactNode;
};

export const DataBlockTableProvider: React.FC<DataBlockTableProviderProps> = ({ children }) => {
  const tableId = useMemo(() => uuidv4(), []);

  const dataBlockTableRef = useRef<AnnotDataBlockTable>({
    payload: {},
    id: tableId,
    getKeyList: [],
  });

  return <DataBlockTableContext.Provider value={dataBlockTableRef}>{children}</DataBlockTableContext.Provider>;
};
