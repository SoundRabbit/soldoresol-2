import React from 'react';

import { Icon, IconProps } from '@chakra-ui/react';

export type PaperAirPlaneIconProps = IconProps & {
  color?: string;
};

export const PaperAirPlaneIcon: React.FC<PaperAirPlaneIconProps> = ({ color, ...props }) => {
  return (
    <Icon viewBox='0 0 512 512' {...props}>
      <polygon points='121.71,463.73 211.257,394.524 121.71,333.638' fill={color ?? 'currentColor'} />
      <polygon
        points='0,216.127 122.938,305.26 465.837,86.043 152.628,326.791 335.73,459.532 512,48.27 	'
        fill={color ?? 'currentColor'}
      ></polygon>
    </Icon>
  );
};
