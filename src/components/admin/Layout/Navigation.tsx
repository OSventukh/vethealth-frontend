import { useState } from 'react';
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

export default function Navigation({ open }: NavigationProps) {
  const [openPostMenu, setOpenPostMenu] = useState(false);
  const [openTopicMenu, setOpenTopicMenu] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState(0);

  const postMenuClickHandler = (event: React.MouseEvent, item: number) => {
    setOpenPostMenu((prevState) => !prevState);
    setSelectedMenu(item);
  };

  const topicMenuClickHandler = (event: React.MouseEvent, item: number) => {
    setOpenTopicMenu((prevState) => !prevState);
    setSelectedMenu(item)
  }

  const menuSelectHandler = (event: React.MouseEvent, item: number) => {
    setSelectedMenu(item);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader />

      <List>
        <NavItem
          link="/admin"
          open={open}
          icon={<Home />}
          onClick={(event) => menuSelectHandler(event, 0)}
          selected={selectedMenu === 0}
        >
          Home
        </NavItem>
        <NavItem
          link="/admin/topics"
          open={open}
          icon={<ViewComfyAlt />}
          onClick={(event) => topicMenuClickHandler(event, 1)}
          expandIcon={openTopicMenu ? <ExpandLess /> : <ExpandMore />}
          selected={selectedMenu === 1}
        >
          Topics
        </NavItem>
        <Collapse in={open && openTopicMenu} timeout="auto" unmountOnExit>
          <List disablePadding sx={{ pl: '1rem' }}>
            <NavItem
              link="/admin/topics"
              open={open}
              onClick={(event) => menuSelectHandler(event, 1.1)}
              selected={selectedMenu === 1.1}
            >
              All topics
            </NavItem>
            <NavItem
              link="/admin/topics/new"
              open={open}
              onClick={(event) => menuSelectHandler(event, 1.2)}
              selected={selectedMenu === 1.2}
            >
              New Topic
            </NavItem>
          </List>
        </Collapse>
        <NavItem
          link="/admin/posts"
          open={open}
          icon={<Article />}
          expandIcon={openPostMenu ? <ExpandLess /> : <ExpandMore />}
          onClick={(event: React.MouseEvent) => postMenuClickHandler(event, 2)}
          selected={selectedMenu === 2}
        >
          Posts
        </NavItem>
        <Collapse in={open && openPostMenu} timeout="auto" unmountOnExit>
          <List disablePadding sx={{ pl: '1rem' }}>
            <NavItem
              link="/admin/posts"
              open={open}
              onClick={(event) => menuSelectHandler(event, 3)}
              selected={selectedMenu === 3}
            >
              All posts
            </NavItem>
            <NavItem
              link="/admin/posts/categories"
              open={open}
              onClick={(event) => menuSelectHandler(event, 4)}
              selected={selectedMenu === 4}
            >
              Categories
            </NavItem>
          </List>
        </Collapse>
        <NavItem
          link="/admin/pages"
          open={open}
          icon={<Web />}
          onClick={(event) => menuSelectHandler(event, 5)}
          selected={selectedMenu === 5}
        >
          Pages
        </NavItem>
        <NavItem
          link="/admin/users"
          open={open}
          icon={<Group />}
          onClick={(event) => menuSelectHandler(event, 6)}
          selected={selectedMenu === 6}
        >
          Users
        </NavItem>
        <NavItem
          link="/admin/settings"
          open={open}
          icon={<Settings />}
          onClick={(event) => menuSelectHandler(event, 7)}
          selected={selectedMenu === 7}
        >
          Settings
        </NavItem>
      </List>
    </Drawer>
  );
}
