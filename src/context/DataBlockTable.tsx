import React, { MutableRefObject, useRef } from 'react';
import { AnnotDataBlock } from './DataBlockTable/annotDataBlock';
import { DataBlockId } from '@/dataBlock';

export type DataBlockTable = Record<DataBlockId, AnnotDataBlock | undefined>;

export type AnnotDataBlockTable = {
  payload: DataBlockTable;
  getKeyList: ((index: number) => any)[];
};

export const DataBlockTableContext = React.createContext<MutableRefObject<AnnotDataBlockTable> | undefined>(undefined);

export type DataBlockTableProviderProps = {
  children?: React.ReactNode;
};

export const DataBlockTableProvider: React.FC<DataBlockTableProviderProps> = ({ children }) => {
  const dataBlockTableRef = useRef<AnnotDataBlockTable>({
    payload: {},
    getKeyList: [],
  });

  return <DataBlockTableContext.Provider value={dataBlockTableRef}>{children}</DataBlockTableContext.Provider>;
};
