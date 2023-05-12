import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from '@mui/material/List';
import {
  Home,
  Article,
  ExpandMore,
  ExpandLess,
  ViewComfyAlt,
  Web,
  Settings,
  Group,
} from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import { Drawer, DrawerHeader } from '@/components/admin/Layout/drawer';
import type { NavigationProps } from '@/types/props-types';
import NavItem from './NavItem';
import routes from '@/utils/routesList';

export default function Navigation({ open }: NavigationProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter();

  const menuClickHandler = (event: React.MouseEvent, item: string) => {
    setOpenMenu((prevState) => (prevState !== item ? item : null));
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader />

      <List>
        <NavItem
          link="/admin"
          open={open}
          icon={<Home />}
          selected={router.pathname === routes.home}
        >
          Home
        </NavItem>
        <NavItem
          link="/admin/topics"
          open={open}
          icon={<ViewComfyAlt />}
          onClick={(event) => menuClickHandler(event, routes.topics.all)}
          expandIcon={
            openMenu === routes.topics.all ? <ExpandLess /> : <ExpandMore />
          }
          selected={router.pathname.startsWith(routes.topics.all)}
        >
          Topics
        </NavItem>
        <Collapse
          in={open && openMenu === routes.topics.all}
          timeout="auto"
          unmountOnExit
        >
          <List disablePadding sx={{ pl: '1rem' }}>
            <NavItem
              link={routes.topics.all}
              open={open}
              nested
              selected={router.pathname === routes.topics.all}
            >
              All topics
            </NavItem>
            <NavItem
              link={routes.topics.new}
              open={open}
              nested
              selected={router.pathname === routes.topics.new}
            >
              New Topic
            </NavItem>
          </List>
        </Collapse>
        <NavItem
          link={routes.posts.all}
          open={open}
          icon={<Article />}
          expandIcon={openMenu ? <ExpandLess /> : <ExpandMore />}
          onClick={(event: React.MouseEvent) =>
            menuClickHandler(event, routes.posts.all)
          }
          selected={router.pathname.startsWith(routes.posts.all)}
        >
          Posts
        </NavItem>
        <Collapse
          in={open && openMenu === routes.posts.all}
          timeout="auto"
          unmountOnExit
        >
          <List disablePadding sx={{ pl: '1rem' }}>
            <NavItem
              link={routes.posts.all}
              open={open}
              nested
              selected={router.pathname === routes.posts.all}
            >
              All posts
            </NavItem>
            <NavItem
              link={routes.posts.new}
              open={open}
              nested
              selected={router.pathname === routes.posts.new}
            >
              New Post
            </NavItem>
            <NavItem
              link={routes.posts.categories}
              open={open}
              nested
              selected={router.pathname === routes.posts.categories}
            >
              Categories
            </NavItem>
            <NavItem
              link={routes.posts.newCategory}
              open={open}
              nested
              selected={router.pathname === routes.posts.newCategory}
            >
              New Category
            </NavItem>
          </List>
        </Collapse>
        <NavItem
          link={routes.pages.all}
          open={open}
          icon={<Web />}
          selected={router.pathname.startsWith(routes.pages.all)}
        >
          Pages
        </NavItem>
        <NavItem
          link={routes.users.all}
          open={open}
          icon={<Group />}
          selected={router.pathname.startsWith(routes.users.all)}
          expandIcon={openMenu ? <ExpandLess /> : <ExpandMore />}
          onClick={(event: React.MouseEvent) =>
            menuClickHandler(event, routes.users.all)
          }
        >
          Users
        </NavItem>
        <Collapse
          in={open && openMenu === routes.users.all}
          timeout="auto"
          unmountOnExit
        >
          <List disablePadding sx={{ pl: '1rem' }}>
            <NavItem
              link={routes.users.all}
              open={open}
              nested
              selected={router.pathname === routes.users.all}
            >
              All users
            </NavItem>
            <NavItem
              link={routes.users.new}
              open={open}
              nested
              selected={router.pathname === routes.users.new}
            >
              New users
            </NavItem>
          </List>
        </Collapse>
        <NavItem
          link={routes.settings.general}
          open={open}
          icon={<Settings />}
          selected={router.pathname.startsWith(routes.settings.general)}
        >
          Settings
        </NavItem>
      </List>
    </Drawer>
  );
}
