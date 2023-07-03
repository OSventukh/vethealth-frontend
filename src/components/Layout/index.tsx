import dynamic from 'next/dynamic';
const Header = dynamic(() => import('./Header'));
const Footer = dynamic(() => import('./Footer'));
import { Raleway } from 'next/font/google';
import Container from '@mui/material/Container';
import type { Header as HeaderType } from '@/types/props-types';
import React from 'react';
const releway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function Layout(
  props: HeaderType & { children: React.ReactNode }
) {
  return (
    <>
      <Header general={props.general} navigationMenu={props.navigationMenu} />
      <main>
        <Container>
          {props?.general?.siteDescription && (
            <div className="description">
              <h2 className={releway.className}>
                {props.general.siteDescription}
              </h2>
            </div>
          )}
          {props.children}
        </Container>
      </main>
      <Footer />
    </>
  );
}
