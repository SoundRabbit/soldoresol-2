'use client';

import { RecoilRoot } from 'recoil';

import { ChakraProvider } from '@chakra-ui/react';

import { DataBlockTableContextProvider } from '@/component/context/DataBlockTableContext';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <DataBlockTableContextProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </DataBlockTableContextProvider>
    </RecoilRoot>
  );
};

export default Providers;
