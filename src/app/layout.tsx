import { Metadata } from 'next';
import { fonts } from './fonts';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Soldoresol',
};

export const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='ja' className={fonts.notoSnasJp.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
