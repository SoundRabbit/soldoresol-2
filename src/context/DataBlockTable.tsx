import React, { MutableRefObject, useRef } from 'react';
import { AnnotDataBlock } from './DataBlockTable/annotDataBlock';
import { DataBlockId } from '@/dataBlock';

export type DataBlockTable = {
  [id: DataBlockId]: AnnotDataBlock | undefined;
};

export const DataBlockTableContext = React.createContext<MutableRefObject<DataBlockTable> | undefined>(undefined);

export type DataBlockTableProviderProps = {
  children?: React.ReactNode;
};

export const DataBlockTableProvider: React.FC<DataBlockTableProviderProps> = ({ children }) => {
  const dataBlockTableRef = useRef<DataBlockTable>({});

  return <DataBlockTableContext.Provider value={dataBlockTableRef}>{children}</DataBlockTableContext.Provider>;
};
