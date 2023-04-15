export interface Data {
  id: number;
  title: string;
  description?: string;
  createdAt?: Date;
  slug?: string;
  excerpt?: string;
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
  numSelected: number;
  title: string;
  onDelete: () => void;
}

export interface EnhancedTableProps {
  data: Data[];
  title: string;
  page: number;
  size: number;
  header: HeadCell[]
  order: 'asc' | 'desc';
  orderBy: string;
  count: number;
  onSort: (newOrderBy: string) => void;
  onSize: (size: number) => void;
  onPage: (page: number) => void;
  onItemsDelete: (selected: readonly number[]) => void;
}

interface ModalProps {
  open: boolean;
  title?: string;
  content: string | ReactElement;
  onAgree: () => void;
  agreeButton?: string;
  disagreeButton?: string;
  setOpen: (arg: boolean) => void;
}
