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
    new: '/admin/topics/new'
  },
  posts: {
    all: '/admin/posts',
    categories: '/admin/posts/categories'
  },
  pages: {
    all: '/admin/pages',
  },
  users: {
    all: '/admin/users'
  },
  settings: {
    home: '/admin/settings',
  }
}
export default function Navigation({ open }: NavigationProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openTopicMenu, setOpenTopicMenu] = useState(false);
  const router = useRouter();

  const menuClickHandler = (event: React.MouseEvent, item: string) => {
    setOpenMenu((prevState) => prevState !== item ? item : null);
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
          expandIcon={openMenu === links.topics.all ? <ExpandLess /> : <ExpandMore />}
          selected={router.pathname.startsWith(links.topics.all)}
        >
          Topics
        </NavItem>
        <Collapse in={open && openMenu === links.topics.all} timeout="auto" unmountOnExit>
          <List disablePadding sx={{ pl: '1rem' }}>
            <NavItem
              link="/admin/topics"
              open={open}
              nested
              selected={router.pathname === links.topics.all}
            >
              All topics
            </NavItem>
            <NavItem
              link="/admin/topics/new"
              open={open}
              nested
              selected={router.pathname === links.topics.new}
            >
              New Topic
            </NavItem>
          </List>
        </Collapse>
        <NavItem
          link="/admin/posts"
          open={open}
          icon={<Article />}
          expandIcon={openMenu ? <ExpandLess /> : <ExpandMore />}
          onClick={(event: React.MouseEvent) => menuClickHandler(event, links.posts.all)}
          selected={router.pathname.startsWith(links.posts.all)}
        >
          Posts
        </NavItem>
        <Collapse in={open && openMenu === links.posts.all} timeout="auto" unmountOnExit>
          <List disablePadding sx={{ pl: '1rem' }}>
            <NavItem
              link="/admin/posts"
              open={open}
              nested
              selected={router.pathname === links.posts.all}
            >
              All posts
            </NavItem>
            <NavItem
              link="/admin/posts/categories"
              open={open}
              nested
              selected={router.pathname === links.posts.categories}
            >
              Categories
            </NavItem>
          </List>
        </Collapse>
        <NavItem
          link="/admin/pages"
          open={open}
          icon={<Web />}
          selected={router.pathname.startsWith(links.pages.all)}
        >
          Pages
        </NavItem>
        <NavItem
          link="/admin/users"
          open={open}
          icon={<Group />}
          selected={router.pathname.startsWith(links.users.all)}
        >
          Users
        </NavItem>
        <NavItem
          link="/admin/settings"
          open={open}
          icon={<Settings />}
          selected={router.pathname.startsWith(links.settings.home)}
        >
          Settings
        </NavItem>
      </List>
    </Drawer>
  );
}
