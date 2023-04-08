export interface ChildrenProps {
  children: ReactElement,
}

export interface NavigationProps {
  open: boolean;
  handleDrawerToggle?: () => void;
}