import Link from 'next/link';
import dynamic from 'next/dynamic';
import Container from '@mui/material/Container';
import { Raleway } from 'next/font/google';
const MobileNavigation = dynamic(() => import('./MobileNavigation'));
const MainNavigation = dynamic(() => import('./Navigation'));
import type { Header } from '@/types/props-types';
import classes from '@/styles/layout/Header.module.css';
import  Search from '../Search';
import CustomSearch from '../Search/CustomSearch';
const releway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function Header(props: Header) {
  const { name } = props.general;

  return (
    <header className={`${classes.header} ${releway.className}`}>
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'row', sm: 'column', md: 'row' },
          gap: '2rem',
        }}
      >
        <Link href="/" className={classes['site-name']}>
          <h1 className={classes['site-title']}>
            <img src="/vethealth-logo.svg" alt={name} />
          </h1>
        </Link>
        <div className={classes.navigation}>
          {props.navigationMenu && props.navigationMenu.length > 0 && (
            <>
              <MainNavigation data={props.navigationMenu} />
              <MobileNavigation data={props.navigationMenu} />
            </>
          )}
           <CustomSearch />

        </div>
      </Container>
    </header>
  );
}
