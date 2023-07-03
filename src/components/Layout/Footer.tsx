import Container from '@mui/material/Container';
import dynamic from 'next/dynamic';
const Search = dynamic(() => import('../Search'))

import classes from '@/styles/layout/Footer.module.css';

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Container>
        <div className={classes['footer__wrapper']}>
          <div className={classes['footer__copyright']}> &copy; VetHealth</div>
          <div className={classes['footer__navigation']}></div>

          <div className={classes['footer__search']}>
            <Search />
          </div>
        </div>
      </Container>
    </footer>
  );
}
