import { Noto_Sans_JP } from 'next/font/google';

const notoSnasJp = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
});

export const fonts = {
  notoSnasJp,
};
