'use client';

import React, { useCallback, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex, FlexProps } from '@chakra-ui/react';

import { NonChildren } from '@/lib/util/utilityTypes';

export type SidePanelProps = NonChildren<FlexProps> & {
  panelPposition: 'left' | 'right';
  children: (isOpened: boolean) => FlexProps['children'];
};

export const SidePanel: React.FC<SidePanelProps> = ({ panelPposition, children, ...props }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  return (
    <Flex {...props}>
      {panelPposition === 'right' ?
        <Flex as={Button} height={'auto'} onClick={handleToggle}>
          <ChevronLeftIcon />
        </Flex>
      : null}
      {children(isOpened)}
      {panelPposition === 'left' ?
        <Flex as={Button} height={'auto'} onClick={handleToggle}>
          <ChevronRightIcon />
        </Flex>
      : null}
    </Flex>
  );
};
