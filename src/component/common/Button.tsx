import React from 'react';

import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

import { bgColor, txColor } from '@/util/openColor';

export type ButtonProps = ChakraButtonProps & {
  colorVariant?: 'light' | 'red';
};

const Base: React.FC<ChakraButtonProps> = ({ ...props }) => {
  return <ChakraButton variant={'unstyled'} fontWeight={'normal'} padding={'auto 2ch'} height={'2.5em'} {...props} />;
};

const Light: React.FC<ChakraButtonProps> = ({ ...props }) => {
  return (
    <Base
      backgroundColor={bgColor.gray[0].hex()}
      color={txColor.gray[4].hex()}
      _hover={{ backgroundColor: bgColor.gray[1].hex() }}
      {...props}
    />
  );
};

const Red: React.FC<ChakraButtonProps> = ({ ...props }) => {
  return (
    <Base
      backgroundColor={bgColor.red[4].hex()}
      color={txColor.gray[0].hex()}
      _hover={{ backgroundColor: bgColor.red[3].hex() }}
      {...props}
    />
  );
};

export const Button: React.FC<ButtonProps> = ({ colorVariant, ...props }) => {
  switch (colorVariant) {
    case 'light':
      return <Light {...props} />;
    case 'red':
      return <Red {...props} />;
    default:
      return <Base {...props} />;
  }
};
