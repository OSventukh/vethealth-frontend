import Link from 'next/link';
import dynamic from 'next/dynamic';
import Container from '@mui/material/Container';
import { Raleway } from 'next/font/google';
const MobileNavigation = dynamic(
  () => import('@/components/navigation/mobile/MobileNavigation')
);
const MainNavigation = dynamic(
  () => import('@/components/navigation/common/Navigation')
);
import type { Header } from '@/types/props-types';
import Logo from '@/components/logo';
import classes from '@/styles/layout/Header.module.css';
import CustomSearch from '@/components/search';
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
        <Logo />
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
