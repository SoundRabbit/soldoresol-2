'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { DataBlockProvider } from '@/context/DataBlock';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <DataBlockProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </DataBlockProvider>
  );
};

export default Providers;
