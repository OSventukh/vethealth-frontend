
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Container from '@mui/material/Container';
import { Raleway } from 'next/font/google';
const MobileNavigation = dynamic(() => import('./MobileNavigation'));
const MainNavigation = dynamic(() => import('./Navigation'))
import type { Header } from '@/types/props-types';
import blobImage from '@/assets/svg/blob-haikei.svg'
import classes from '@/styles/layout/Header.module.css';
const releway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function Header(props: Header) {
  const { siteName } = props.general;
  const headerClasses = `${releway.className} ${classes.header}`;
  return (
    <header className={headerClasses}>
      <div className={classes.blob}>
      </div>
        <div className={classes['site-name']}>
          
        </div>
      
    </header>
  );
}
