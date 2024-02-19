import { Icon, IconProps } from '@chakra-ui/react';
import React from 'react';

export type CheckBoxIconProps = IconProps & {
  isChecked?: boolean;
  isOutlined?: boolean;
  color?: string;
  bgColor?: string;
};

export const CheckBoxIcon: React.FC<CheckBoxIconProps> = ({ isChecked, isOutlined, bgColor, color, ...props }) => {
  isChecked = isChecked ?? true;
  isOutlined = isOutlined ?? false;
  return (
    <Icon viewBox='0 0 512 512' {...props}>
      <rect
        strokeWidth='32'
        x='16'
        y='16'
        width='480'
        height='480'
        id='svg_9'
        rx='32'
        stroke={isOutlined ? color ?? 'currentColor' : 'none'}
        fill={bgColor ?? 'none'}
      />
      {isChecked && (
        <polygon
          stroke='none'
          fill={color ?? 'currentColor'}
          points='395.00518798828125,118.41299438476562 227.63441467285156,285.78375244140625 116.99481964111328,175.15170288085938 63.09320068359375,229.0450439453125 173.73277282714844,339.6846008300781 227.63441467285156,393.5870056152344 281.52850341796875,339.6846008300781 448.90679931640625,172.31536865234375 '
        />
      )}
    </Icon>
  );
};
