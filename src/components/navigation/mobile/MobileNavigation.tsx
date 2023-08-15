import { useState } from 'react';
import { useRouter } from 'next/router';
import type { Category } from '@/types/content-types';
import BurgerButton from '@/components/navigation/mobile/BurgerButton';
import SideMenu from '@/components/navigation/mobile/SideMenu';
import classes from '@/components/navigation/Navigation.module.css';


export default function MobileNavigation({ data }: { data: Category[] }) {
  const router = useRouter();
  const topic = router.query.topic;

  const [openNav, setOpenNav] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpenNav(open);
    };
  return (
    <div className={classes['mobile-menu']}>
      <BurgerButton onClick={toggleDrawer(true)} />
      <SideMenu
        open={openNav}
        data={data}
        onClose={toggleDrawer(false)}
        anchor={topic as string}
      />
    </div>
  );
}
