import { Icon, IconProps } from '@chakra-ui/react';
import React from 'react';

export type ChevronDownIconProps = IconProps & {
  color?: string;
};

export const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({ color, ...props }) => {
  return (
    <Icon viewBox='0 0 512 512' {...props}>
      <polygon
        points='440.189,92.085 256.019,276.255 71.83,92.085 0,163.915 256.019,419.915 512,163.915'
        fill={color ?? 'currentColor'}
      ></polygon>
    </Icon>
  );
};
