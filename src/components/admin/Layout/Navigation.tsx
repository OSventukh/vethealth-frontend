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

const links = {
  home: '/admin',
  topics: {
    all: '/admin/topics',
    new: '/admin/topics/new',
  },
  posts: {
    all: '/admin/posts',
    new: '/admin/posts/new',
    categories: '/admin/posts/categories',
    newCategory: '/admin/posts/categories/new',
  },
  pages: {
    all: '/admin/pages',
  },
  users: {
    all: '/admin/users',
    new: '/admin/users/new',
  },
  settings: {
    general: '/admin/settings',
  },
};
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
          selected={router.pathname === links.home}
        >
          Home
        </NavItem>
        <NavItem
          link="/admin/topics"
          open={open}
          icon={<ViewComfyAlt />}
          onClick={(event) => menuClickHandler(event, links.topics.all)}
          expandIcon={
            openMenu === links.topics.all ? <ExpandLess /> : <ExpandMore />
          }
          selected={router.pathname.startsWith(links.topics.all)}
        >
          Topics
        </NavItem>
        <Collapse
          in={open && openMenu === links.topics.all}
          timeout="auto"
          unmountOnExit
        >
          <List disablePadding sx={{ pl: '1rem' }}>
            <NavItem
              link={links.topics.all}
              open={open}
              nested
              selected={router.pathname === links.topics.all}
            >
              All topics
            </NavItem>
            <NavItem
              link={links.topics.new}
              open={open}
              nested
              selected={router.pathname === links.topics.new}
            >
              New Topic
            </NavItem>
          </List>
        </Collapse>
        <NavItem
          link={links.posts.all}
          open={open}
          icon={<Article />}
          expandIcon={openMenu ? <ExpandLess /> : <ExpandMore />}
          onClick={(event: React.MouseEvent) =>
            menuClickHandler(event, links.posts.all)
          }
          selected={router.pathname.startsWith(links.posts.all)}
        >
          Posts
        </NavItem>
        <Collapse
          in={open && openMenu === links.posts.all}
          timeout="auto"
          unmountOnExit
        >
          <List disablePadding sx={{ pl: '1rem' }}>
            <NavItem
              link={links.posts.all}
              open={open}
              nested
              selected={router.pathname === links.posts.all}
            >
              All posts
            </NavItem>
            <NavItem
              link={links.posts.new}
              open={open}
              nested
              selected={router.pathname === links.posts.new}
            >
              New Post
            </NavItem>
            <NavItem
              link={links.posts.categories}
              open={open}
              nested
              selected={router.pathname === links.posts.categories}
            >
              Categories
            </NavItem>
            <NavItem
              link={links.posts.newCategory}
              open={open}
              nested
              selected={router.pathname === links.posts.newCategory}
            >
              New Category
            </NavItem>
          </List>
        </Collapse>
        <NavItem
          link={links.pages.all}
          open={open}
          icon={<Web />}
          selected={router.pathname.startsWith(links.pages.all)}
        >
          Pages
        </NavItem>
        <NavItem
          link={links.users.all}
          open={open}
          icon={<Group />}
          selected={router.pathname.startsWith(links.users.all)}
          expandIcon={openMenu ? <ExpandLess /> : <ExpandMore />}
          onClick={(event: React.MouseEvent) =>
            menuClickHandler(event, links.users.all)
          }
        >
          Users
        </NavItem>
        <Collapse
          in={open && openMenu === links.users.all}
          timeout="auto"
          unmountOnExit
        >
          <List disablePadding sx={{ pl: '1rem' }}>
            <NavItem
              link={links.users.all}
              open={open}
              nested
              selected={router.pathname === links.users.all}
            >
              All users
            </NavItem>
            <NavItem
              link={links.users.new}
              open={open}
              nested
              selected={router.pathname === links.users.new}
            >
              New users
            </NavItem>
          </List>
        </Collapse>
        <NavItem
          link={links.settings.general}
          open={open}
          icon={<Settings />}
          selected={router.pathname.startsWith(links.settings.general)}
        >
          Settings
        </NavItem>
      </List>
    </Drawer>
  );
}
