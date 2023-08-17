import Link from 'next/link';
import classes from './Logo.module.css';

export default function Logo() {
  return (
    <Link href="/" className={classes['site-name']}>
      <h1 className={classes['site-title']}>
        <img src="/logo/vethealth-logo.svg" alt='VetHealth.com.ua' />
      </h1>
    </Link>
  );
}
