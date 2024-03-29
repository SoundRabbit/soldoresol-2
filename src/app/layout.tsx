import { Metadata } from 'next';

import { Box } from '@chakra-ui/react';

import { fonts } from './fonts';
import { Providers } from './providers';
import './style.css';

export const metadata: Metadata = {
  title: 'Soldoresol',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='ja' className={fonts.notoSnasJp.variable}>
      <body>
        <Providers>
          <Box width={'100vw'} height={'100vh'} overflow={'hidden'}>
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
