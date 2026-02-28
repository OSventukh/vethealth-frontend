import React from 'react';
import { raleway } from '@/lib/fonts';

type Props = {
  title?: string;
};

const defaultTitle = 'Лікування та догляд за тваринами';

export default function Description({ title = defaultTitle }: Props) {
  return (
    <h1
      className={`${raleway.className} my-8 text-center text-lg font-normal uppercase`}
    >
      {title}
    </h1>
  );
}
