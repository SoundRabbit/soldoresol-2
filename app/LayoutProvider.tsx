'use client';

import React from 'react';
import { RecoilRoot } from 'recoil';

import { ChakraProvider } from '@chakra-ui/react';

import { useSetDataBlockTableChannelEffect } from '@/lib/hook/useDataBlockTableChannelState';

type ChildrenOnly = {
  children: React.ReactNode;
};

export type LayoutProviderProps = ChildrenOnly;

const RecoilInitializer: React.FC<ChildrenOnly> = ({ children }) => {
  useSetDataBlockTableChannelEffect();

  return children;
};

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <RecoilInitializer>{children}</RecoilInitializer>
      </ChakraProvider>
    </RecoilRoot>
  );
};
