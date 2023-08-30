import dynamic from 'next/dynamic';
const Header = dynamic(() => import('@/blocks/public/Header'));
const Footer = dynamic(() => import('@/blocks/public/Footer'));
import Container from '@mui/material/Container';
import type { Header as HeaderType } from '@/types/props-types';
import React from 'react';
import { Raleway } from 'next/font/google';
const releway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function Layout(
  props: HeaderType & { children: React.ReactNode }
) {
  return (
    <>
      <Header general={props.general} navigationMenu={props.navigationMenu} />
      <main>
        <Container>
          {props?.general?.description && (
            <div className="description">
              <h2 className={releway.className}>
                {props.general.description}
              </h2>
            </div>
          )}
          {props.children}
        </Container>
      </main>
      <Footer general={props.general} />
    </>
  );
}
