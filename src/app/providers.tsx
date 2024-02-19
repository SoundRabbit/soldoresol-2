'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { DataBlockTableProvider } from '@/context/DataBlockTable';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <DataBlockTableProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </DataBlockTableProvider>
  );
};

export default Providers;
