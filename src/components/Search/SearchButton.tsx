import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import classes from './Search.module.css';

export default function SearchButton() {
  return (
    <Button className={classes.submit} type="submit">
      <SearchIcon />
    </Button>
  );
}
