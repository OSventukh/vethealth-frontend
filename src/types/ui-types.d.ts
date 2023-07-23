export interface Data {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  slug?: string;
  excerpt?: string;
  parent?: Data;
  children?: Data[];
}

export interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

export interface EnhancedTableHeadProps {
  header: HeadCell[];
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    newOrderBy: keyof HeadCell
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
}

export interface EnhancedTableToolbarProps {
  selected: readonly string[];
  title: string;
  onDelete: () => void;
}

export interface EnhancedTableProps {
  data: Data[];
  title: string;
  page: number;
  size: number;
  header: HeadCell[];
  order: 'asc' | 'desc';
  orderBy: string;
  count: number;
  onSort: (newOrderBy: string) => void;
  onSize: (size: number) => void;
  onPage: (page: number) => void;
  onItemsDelete: (selected: readonly string[]) => void;
}

export interface TableRowTreeProps {
  handleClick: (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    rowId: string
  ) => void;
  row: Data;
  selected: readonly string[];
  index: number;
  children?: boolean;
}

interface ModalProps {
  open: boolean;
  title?: string;
  content: string | ReactElement;
  onAgree: () => void;
  agreeButton?: string;
  disagreeButton?: string;
  notificationOnly?: boolean;
  setOpen: (arg: boolean) => void;
}

export interface SwitchButtonProps {
  checked: boolean;
  onChange: () => void;
}

export interface ThemeContext {
  toggleColorMode: () => void;
  mode: string;
}
