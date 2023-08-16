import { ChangeEventHandler } from 'react';
import classes from './Search.module.css';

type SearchInput = {
  value: string;
  onChange: ChangeEventHandler
}

export default function SearchInput({ value, onChange }: SearchInput) {
  return (
    <input
      value={value}
      type="text"
      className={classes.input}
      placeholder="Пошук..."
      required
      onChange={onChange}
    />
  );
}
