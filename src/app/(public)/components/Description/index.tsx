import React from 'react';
import { Raleway } from 'next/font/google';

type Props = {
  title?: string;
};

const defaultTitle = 'Лікування та догляд за тваринами';

const releway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function Description({ title = defaultTitle }: Props) {
  return (
    <h1
      className={`${releway.className} my-8 text-center text-lg font-normal uppercase`}
    >
      {title}
    </h1>
  );
}
