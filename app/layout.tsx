import { Metadata } from 'next';

import { Box } from '@chakra-ui/react';

import { LayoutProvider } from './LayoutProvider';
import { fonts } from './fonts';
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
        <LayoutProvider>
          <Box width={'100vw'} height={'100vh'} overflow={'hidden'}>
            {children}
          </Box>
        </LayoutProvider>
      </body>
    </html>
  );
};

export default RootLayout;
