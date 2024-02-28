import React from 'react';

import { Grid, GridProps } from '@chakra-ui/react';

export type KeyValueProps = GridProps & {
  alignment?: ('k' | 'v')[];
};

export const KeyValue: React.FC<KeyValueProps> = ({ alignment, children, ...props }) => {
  alignment = alignment ?? ['k', 'v'];
  return (
    <Grid
      gridTemplateColumns={alignment.map((a) => (a === 'k' ? 'max-content' : '1fr')).join(' ')}
      gridAutoRows={'max-content'}
      columnGap={'1ch'}
      alignItems={'center'}
      {...props}
    >
      {children}
    </Grid>
  );
};
