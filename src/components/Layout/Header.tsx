
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Container from '@mui/material/Container';
import { Raleway } from 'next/font/google';
const MobileNavigation = dynamic(() => import('./MobileNavigation'));
const MainNavigation = dynamic(() => import('./Navigation'))
import type { Header } from '@/types/props-types';

import classes from '@/styles/layout/Header.module.css';
const releway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function Header(props: Header) {
  const { siteName } = props.general;
  const headerClasses = `${releway.className} ${classes.header}`;
  return (
    <header className={headerClasses}>
      <Container>
        <h1 className={classes['site-name']}>
          <Link href="/">{siteName}</Link>
        </h1>
        {props.navigationMenu && (
          <>
            <MainNavigation data={props.navigationMenu} />
            <MobileNavigation data={props.navigationMenu} />
          </>
        )}
      </Container>
    </header>
  );
}
