import React, { MutableRefObject, useRef } from 'react';
import { DataBlock, DataBlockId } from '@/dataBlock';

export interface AnnotDataBlock extends DataBlock {
  updateTimestamp: number;
  isAvailable: boolean;
}

export type DataBlockTable = {
  [id: DataBlockId]: AnnotDataBlock | undefined;
};

export const DataBlockTableContext = React.createContext<MutableRefObject<DataBlockTable> | undefined>(undefined);

export type DataBlockProviderProps = {
  children?: React.ReactNode;
};

export const DataBlockProvider: React.FC<DataBlockProviderProps> = ({ children }) => {
  const dataBlockTableRef = useRef<DataBlockTable>({});

  return <DataBlockTableContext.Provider value={dataBlockTableRef}>{children}</DataBlockTableContext.Provider>;
};
