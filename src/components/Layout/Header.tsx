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
      <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Link href="/">
            <div className={classes['site-name']}>
              <img src="/logo.svg" alt="VetHealth Logo" />
              <h1 className={classes['site-title']}>
                <img src="/title.svg" alt={name} />
              </h1>
            </div>
          </Link>
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
