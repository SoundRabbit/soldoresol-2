import { Textarea as ChakraTextarea, TextareaProps as ChakraTextareaProps } from '@chakra-ui/react';
import React from 'react';
import { openColor } from '@/util/openColor';

export type TextareaProps = ChakraTextareaProps;

export const Textarea: React.FC<TextareaProps> = ({ ...props }) => {
  return (
    <ChakraTextarea
      variant={'unstyled'}
      paddingX={'1ch'}
      paddingY={'0.2em'}
      boxShadow={`inset 0px 0px 2px ${openColor.gray[9].hex()}`}
      backgroundColor={'#fff'}
      color={openColor.gray[9].hex()}
      _disabled={{ backgroundColor: openColor.gray[1].hex() }}
      resize={'none'}
      {...props}
    />
  );
};
