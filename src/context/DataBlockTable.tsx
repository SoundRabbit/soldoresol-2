'use client';

import React, { MutableRefObject, useEffect, useRef } from 'react';

import { DataBlockId } from '@/libs/dataBlock';
import { DataBlockTableChannel } from '@/libs/dataBlockTable';
import { Maybe } from '@/utils/utilityTypes';

import { AnnotDataBlock } from './DataBlockTable/annotDataBlock';

export type DataBlockTable = Record<DataBlockId, AnnotDataBlock | undefined>;

export type AnnotDataBlockTable = {
  channel: Maybe<DataBlockTableChannel>;
  getKeyList: ((index: number) => any)[];
};

export const DataBlockTableContext = React.createContext<Maybe<MutableRefObject<AnnotDataBlockTable>>>(undefined);

export type DataBlockTableProviderProps = {
  children?: React.ReactNode;
};

export const DataBlockTableProvider: React.FC<DataBlockTableProviderProps> = ({ children }) => {
  const dataBlockTableRef = useRef<AnnotDataBlockTable>({
    getKeyList: [],
    channel: undefined,
  });

  useEffect(() => {
    console.log('DataBlockTableProvider');
    dataBlockTableRef.current.channel = DataBlockTableChannel.create();
  }, []);

  return <DataBlockTableContext.Provider value={dataBlockTableRef}>{children}</DataBlockTableContext.Provider>;
};
