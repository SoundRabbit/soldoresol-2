import { Icon, IconProps } from '@chakra-ui/react';
import React from 'react';

export type ChevronUpIconProps = IconProps & {
  color?: string;
};

export const ChevronUpIcon: React.FC<ChevronUpIconProps> = ({ color, ...props }) => {
  return (
    <Icon viewBox='0 0 512 512' {...props}>
      <polygon
        points='255.992,92.089 0,348.081 71.821,419.911 255.992,235.74 440.18,419.911 512,348.081'
        fill={color ?? 'currentColor'}
      ></polygon>
    </Icon>
  );
};
