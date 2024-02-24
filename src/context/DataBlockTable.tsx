'use client';

import React, { MutableRefObject, useMemo, useRef } from 'react';

import { DataBlockId } from '@/libs/dataBlock';
import { DataBlockTableChannel } from '@/libs/dataBlockTable';

import { AnnotDataBlock } from './DataBlockTable/annotDataBlock';

export type DataBlockTable = Record<DataBlockId, AnnotDataBlock | undefined>;

export type AnnotDataBlockTable = {
  channel: DataBlockTableChannel;
  getKeyList: ((index: number) => any)[];
};

export const DataBlockTableContext = React.createContext<MutableRefObject<AnnotDataBlockTable> | undefined>(undefined);

export type DataBlockTableProviderProps = {
  children?: React.ReactNode;
};

export const DataBlockTableProvider: React.FC<DataBlockTableProviderProps> = ({ children }) => {
  const channel = useMemo(() => {
    const channel = new DataBlockTableChannel();
    return channel;
  }, []);

  const dataBlockTableRef = useRef<AnnotDataBlockTable>({
    getKeyList: [],
    channel,
  });

  return <DataBlockTableContext.Provider value={dataBlockTableRef}>{children}</DataBlockTableContext.Provider>;
};
