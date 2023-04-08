export interface ChildrenProps {
  children: ReactElement,
}

export interface NavigationProps {
  open: boolean;
  handleDrawerToggle?: () => void;
}

export interface NavIconProps {
  open: boolean;
  link: string;
  icon?: ReactElement;
  onClick?: (event: React.MouseEvent) => void;
  children: string;
  expandIcon?: ReactElement;
  selected?: boolean;
}