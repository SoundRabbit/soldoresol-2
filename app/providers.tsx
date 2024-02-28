'use client';

import { ChakraProvider } from '@chakra-ui/react';

import { DataBlockTableContextProvider } from '@/component/context/DataBlockTableContext';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <DataBlockTableContextProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </DataBlockTableContextProvider>
  );
};

export default Providers;
