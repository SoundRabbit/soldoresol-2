import { Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react';
import React from 'react';
import { openColor } from '@/util/openColor';

export type InputProps = ChakraInputProps;

export const Input: React.FC<InputProps> = ({ ...props }) => {
  return (
    <ChakraInput
      variant={'unstyled'}
      paddingX={'1ch'}
      paddingY={'0.2em'}
      boxShadow={`inset 0px 0px 2px ${openColor.gray[9].hex()}`}
      backgroundColor={openColor.gray[0].hex()}
      color={openColor.gray[9].hex()}
      _disabled={{ backgroundColor: openColor.gray[1].hex() }}
      {...props}
    />
  );
};
