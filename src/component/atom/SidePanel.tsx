import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex, FlexProps } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

export type SidePanelProps = FlexProps & {
  panelPposition: 'left' | 'right';
};

export const SidePanel: React.FC<SidePanelProps> = ({ panelPposition, children, ...props }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  return (
    <Flex {...props}>
      {panelPposition === 'right' ? (
        <Flex as={Button} height={'auto'} onClick={handleToggle}>
          <ChevronLeftIcon />
        </Flex>
      ) : null}
      {isOpened ? children : null}
      {panelPposition === 'left' ? (
        <Flex as={Button} height={'auto'} onClick={handleToggle}>
          <ChevronRightIcon />
        </Flex>
      ) : null}
    </Flex>
  );
};
