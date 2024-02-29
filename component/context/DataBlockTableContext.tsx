'use client';

import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';

import { DataBlockTableChannel } from '@/lib/dataBlockTable';
import { Maybe } from '@/lib/type/utilityTypes';

export type DataBlockTableContextMutData = {
  getKeyList: ((index: number) => any)[];
};

export type DataBlockTableContextData = {
  channel: DataBlockTableChannel;
  mutData: MutableRefObject<DataBlockTableContextMutData>;
};

export const DataBlockTableContext = React.createContext<Maybe<DataBlockTableContextData>>(undefined);

export type DataBlockTableProviderProps = {
  children?: React.ReactNode;
};

export const DataBlockTableContextProvider: React.FC<DataBlockTableProviderProps> = ({ children }) => {
  const mutDataRef = useRef<DataBlockTableContextMutData>({
    getKeyList: [],
  });

  const [channel, setChannel] = useState<Maybe<DataBlockTableChannel>>(undefined);

  const contextData = useMemo(() => (channel ? { channel, mutData: mutDataRef } : undefined), [channel]);

  useEffect(() => {
    setChannel((prev) => {
      prev?.worker?.port.close();
      return DataBlockTableChannel.create();
    });
  }, []);

  return <DataBlockTableContext.Provider value={contextData}>{children}</DataBlockTableContext.Provider>;
};
