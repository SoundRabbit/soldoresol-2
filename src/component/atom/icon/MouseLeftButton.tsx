import { Icon, IconProps } from '@chakra-ui/react';

export type MouseLeftButtonProps = IconProps & {
  color?: string;
};

export const MouseLeftButton: React.FC<MouseLeftButtonProps> = ({ color, ...props }) => {
  return (
    <Icon viewBox='0 0 24 24' {...props}>
      <svg version='1.1' x='0px' y='0px' viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M432.302,147.948c-19.821-19.867-47.435-32.208-77.724-32.202h-88.664
		c-30.289-0.007-57.903,12.335-77.732,32.194c-19.851,19.82-32.208,47.434-32.194,77.732v124.134
		c0,44.374,16.992,84.84,44.76,114.251c27.691,29.418,66.593,47.959,109.495,47.943c42.901,0.016,81.802-18.525,109.509-47.943
		c27.753-29.411,44.752-69.877,44.752-114.251V225.672C464.511,195.374,452.169,167.76,432.302,147.948z M422.01,349.806
		c0,33.474-12.782,63.478-33.157,85.087c-20.445,21.601-48.052,34.607-78.611,34.622c-30.552-0.015-58.159-13.021-78.596-34.622
		c-20.391-21.609-33.172-51.621-33.172-85.087v-60.031H422.01V349.806z M422.01,259.431H310.758V158.232h43.82
		c18.687,0.015,35.416,7.516,47.689,19.751c12.234,12.273,19.736,28.995,19.743,47.689V259.431z'
          fill={color || 'currentColor'}
        ></path>
      </svg>
    </Icon>
  );
};
