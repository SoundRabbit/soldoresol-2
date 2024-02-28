import React from 'react';

import { Textarea as ChakraTextarea, TextareaProps as ChakraTextareaProps } from '@chakra-ui/react';

import { bgColor, txColor } from '@/lib/util/openColor';

export type TextareaProps = ChakraTextareaProps;

export const Textarea: React.FC<TextareaProps> = ({ ...props }) => {
  return (
    <ChakraTextarea
      variant={'unstyled'}
      paddingX={'1ch'}
      paddingY={'0.2em'}
      boxShadow={`inset 0px 0px 2px ${bgColor.gray[4].hex()}`}
      backgroundColor={'#fff'}
      color={txColor.gray[4].hex()}
      _disabled={{ backgroundColor: bgColor.gray[0].hex() }}
      resize={'none'}
      {...props}
    />
  );
};
