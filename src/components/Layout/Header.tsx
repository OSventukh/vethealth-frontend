import Link from 'next/link';
import dynamic from 'next/dynamic';
import Container from '@mui/material/Container';
import { Raleway } from 'next/font/google';
const MobileNavigation = dynamic(() => import('./MobileNavigation'));
const MainNavigation = dynamic(() => import('./Navigation'));
import type { Header } from '@/types/props-types';

import classes from '@/styles/layout/Header.module.css';
const releway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function Header(props: Header) {
  const { name } = props.general;

  return (
    <header className={`${classes.header} ${releway.className}`}>
      <Container>
        <h1 className={classes['site-name']}>
          <Link href="/">{name}</Link>
        </h1>
        {props.navigationMenu && props.navigationMenu.length > 0 && (
          <>
            <MainNavigation data={props.navigationMenu} />
            <MobileNavigation data={props.navigationMenu} />
          </>
        )}
      </Container>
    </header>
  );
}
