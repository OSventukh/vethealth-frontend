import Header from './Header';
import Footer from './Footer';
import { Raleway } from 'next/font/google';
import Container from '@mui/material/Container';

const releway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function Layout(props) {
  return (
    <>
      <Header
        className={releway.className}
        general={props.general}
        navigationMenu={props.navigationMenu}
      />
      <main>
        <Container>{props.children}</Container>
      </main>
      <Footer />
    </>
  );
}
