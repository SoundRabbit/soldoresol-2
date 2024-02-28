import React from 'react';

import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

import { bgColor, txColor } from '@/lib/util/openColor';

type BaseProps = ChakraButtonProps;

const Base: React.FC<BaseProps> = ({ ...props }) => {
  return <ChakraButton variant={'unstyled'} fontWeight={'normal'} padding={'auto 2ch'} height={'2.5em'} {...props} />;
};

type CommonProps = BaseProps & {
  styleVariant?: 'solid' | 'outline';
};

const Light: React.FC<CommonProps> = ({ ...props }) => {
  return (
    <Base
      backgroundColor={bgColor.gray[0].hex()}
      color={txColor.gray[4].hex()}
      _hover={{ backgroundColor: bgColor.gray[1].hex() }}
      {...props}
    />
  );
};

const Red: React.FC<CommonProps> = ({ ...props }) => {
  return (
    <Base
      backgroundColor={bgColor.red[4].hex()}
      color={txColor.gray[0].hex()}
      _hover={{ backgroundColor: bgColor.red[3].hex() }}
      {...props}
    />
  );
};

const Blue: React.FC<CommonProps> = ({ styleVariant, ...props }) => {
  switch (styleVariant) {
    case 'outline':
      return (
        <Base
          backgroundColor={bgColor.gray[0].hex()}
          color={txColor.blue[4].hex()}
          border={`0.1rem solid ${bgColor.blue[4].hex()}`}
          _hover={{ backgroundColor: bgColor.gray[1].hex() }}
          {...props}
        />
      );
    default:
      return (
        <Base
          backgroundColor={bgColor.blue[4].hex()}
          color={txColor.gray[0].hex()}
          _hover={{ backgroundColor: bgColor.blue[3].hex() }}
          {...props}
        />
      );
  }
};

export type ButtonProps = CommonProps & {
  colorVariant?: 'light' | 'red' | 'blue';
};

export const Button: React.FC<ButtonProps> = ({ colorVariant, ...props }) => {
  switch (colorVariant) {
    case 'light':
      return <Light {...props} />;
    case 'red':
      return <Red {...props} />;
    case 'blue':
      return <Blue {...props} />;
    default:
      return <Base {...props} />;
  }
};
