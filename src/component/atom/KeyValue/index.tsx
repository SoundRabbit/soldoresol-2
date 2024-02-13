import { Grid, GridProps } from '@chakra-ui/react';
import React from 'react';

export type KeyValueProps = GridProps;

export const KeyValue: React.FC<KeyValueProps> = ({ children, ...props }) => {
  return (
    <Grid
      gridTemplateColumns={'max-content 1fr'}
      gridAutoRows={'max-content'}
      columnGap={'1ch'}
      alignItems={'center'}
      {...props}
    >
      {children}
    </Grid>
  );
};
