import Container from '@mui/material/Container';

// import SearchForm from '../SearchForm/SearchForm';

import classes from '@/styles/layout/Footer.module.css';

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Container>
        <div className={classes['footer__copyright']}> &copy; VetHealth</div>
        <div className={classes['footer__navigation']}></div>

        {/* <div className={classes['footer__search']}><SearchForm /></div> */}
      </Container>
    </footer>
  );
}
