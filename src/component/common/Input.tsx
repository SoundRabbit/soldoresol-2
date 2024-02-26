import React from 'react';

import { Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react';

import { bgColor, txColor } from '@/utils/openColor';

export type InputProps = ChakraInputProps;

export const Input: React.FC<InputProps> = ({ ...props }) => {
  return (
    <ChakraInput
      variant={'unstyled'}
      paddingX={'1ch'}
      paddingY={'0.2em'}
      boxShadow={`inset 0px 0px 2px ${bgColor.gray[4].hex()}`}
      backgroundColor={'#fff'}
      color={txColor.gray[4].hex()}
      _disabled={{ backgroundColor: bgColor.gray[0].hex() }}
      {...props}
    />
  );
};
