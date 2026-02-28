import { Inter, Raleway, Roboto } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const raleway = Raleway({ subsets: ['latin', 'cyrillic'] });

export const roboto = Roboto({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
});
