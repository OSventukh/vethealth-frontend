import Header from './Header';
import Footer from './Footer';
import { Raleway } from 'next/font/google';
import Container from '@mui/material/Container';
import type { Header as HeaderType } from '@/types/props-types';
import React from 'react';
const releway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function Layout(props: HeaderType & { children: React.ReactNode}) {
  return (
    <>
      <Header
        general={props.general}
        navigationMenu={props.navigationMenu}
      />
      <main>
        <Container>{props.children}</Container>
      </main>
      <Footer />
    </>
  );
}
