import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { visuallyHidden } from '@mui/utils';
import { api } from '@/hooks/data-hook';
import Modal from './Modal';
// import buildItemsTree from '@/utils/buildItemsTree';
import type {
  HeadCell,
  EnhancedTableHeadProps,
  EnhancedTableProps,
  EnhancedTableToolbarProps,
} from '@/types/ui-types';

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const {
    header,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler =
    (newOrderBy: keyof HeadCell) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, newOrderBy);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {header.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler((headCell as any).id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { selected, title, onDelete } = props;
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();
  const selectedItemsDeleteHandler = useCallback(() => {
    setShowModal(true);
  }, []);

  const deleteAgreeHandler = useCallback(() => {
    setShowModal(false);
    onDelete();
  }, [onDelete]);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selected.length > 0 && {
          bgcolor: (theme) =>
            alpha(
              (theme.palette.primary as any).main,
              (theme.palette as any).action.activatedOpacity
            ),
        }),
      }}
    >
      {selected.length > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}
      {selected.length > 0 ? (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Modal
            open={showModal}
            setOpen={setShowModal}
            title="Delete"
            content={`Are you sure you want to delete ${selected.length} ${
              selected.length === 1 ? 'item' : 'items'
            }?`}
            onAgree={deleteAgreeHandler}
          />
          {selected.length === 1 && (
            <Tooltip title="Edit">
              <IconButton
                component={Link}
                href={`${router.pathname}/${selected[0].toString()}`}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton onClick={selectedItemsDeleteHandler}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

interface TableRowTreeProps {
  handleClick: (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    rowId: number
  ) => void;
  row: { id: number; children?: any[] };
  selected: readonly number[];
  index: number;
}

export function TableRowTree({
  handleClick,
  row,
  selected,
  index,
  children
}: TableRowTreeProps) {
  const [open, setOpen] = useState(false);

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const isItemSelected = isSelected(row.id);
  const labelId = `enhanced-table-checkbox-${index}`;

  const expandTableHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen((prevState) => !prevState);
  };
  return (
    <>
      <TableRow
        hover
        onClick={(event) => handleClick(event, row.id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        sx={{ cursor: 'pointer' }}
        style={{ minWidth: '100%' }}
      >
        <TableCell padding="checkbox">
          {row?.children && row.children.length > 0 && (
            <IconButton onClick={expandTableHandle}>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
          {children && (
            <Box sx={{ pl: 2}}>
              <ArrowRightIcon />

            </Box>
          )}
        </TableCell>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              'aria-labelledby': labelId,
            }}
          />
        </TableCell>

        {Object.entries(row)
          .filter(
            ([key, value]) =>
              key !== 'id' && key !== 'children' && key !== 'parent'
          )
          .map(([key, value], i) => {
            if (key === 'children') {
              return;
            }
            if (key === 'createdAt' || key === 'updatedAt') {
              return (
                <TableCell key={i} align="left">
                  {typeof value === 'string' &&
                    new Date(value).toLocaleString()}
                </TableCell>
              );
            }
            if (key === 'image') {
              return (
                <TableCell key={i} align="left" sx={{ position: 'relative' }}>
                  {value && (
                    <Image
                      src={`${api}/${value}#${new Date().getTime()}`}
                      alt={value.toString()}
                      unoptimized
                      height={40}
                      width={40}
                      style={{ objectFit: 'contain' }}
                    />
                  )}
                </TableCell>
              );
            }
           
            return (
              <TableCell
                key={i}
                align="left"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {value}
              </TableCell>
            );
          })}
      </TableRow>
      {row?.children && row.children.length > 0 && (
        <>
          {open &&
            row.children.map((item, index) => (
              <TableRowTree
                key={item.id}
                row={item}
                handleClick={handleClick}
                selected={selected}
                index={index}
                children
              />
            ))}
        </>
      )}
    </>
  );
}

export default function EnhancedTable({
  title,
  data,
  header,
  onSort,
  onPage,
  onSize,
  order,
  orderBy,
  size,
  page,
  count,
  onItemsDelete,
}: EnhancedTableProps) {
  const [selected, setSelected] = useState<readonly number[]>([]);

  const handleRequestSort = useCallback(
    (event: React.MouseEvent<unknown>, newOrderBy: keyof HeadCell) => {
      onSort(newOrderBy);
    },
    [onSort]
  );

  const itemsDeleteHander = useCallback(() => {
    onItemsDelete(selected);
    setSelected([]);
  }, [onItemsDelete, selected]);

  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      onPage(newPage + 1);
    },
    [onPage]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      onSize(updatedRowsPerPage);
    },
    [onSize]
  );

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  if (!data) {
    return (
      <Paper sx={{ width: '100%', p: '1rem', textAlign: 'center' }}>
        No data
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <EnhancedTableToolbar
        title={title}
        selected={selected}
        onDelete={itemsDeleteHander}
      />
      <TableContainer>
        <Table
          sx={{ minWidth: 750, tableLayout: 'fixed' }}
          aria-labelledby="tableTitle"
          size={'medium'}
        >
          <EnhancedTableHead
            header={header}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />
          <TableBody>
            {data
              ? data.map((row, index) => (
                  <TableRowTree
                    key={row.id}
                    index={index}
                    row={row}
                    handleClick={handleClick}
                    selected={selected}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={size}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
