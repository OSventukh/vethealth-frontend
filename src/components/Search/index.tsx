import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useDebounce from '@/hooks/debounce-hook';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import ListItem from '@mui/material/ListItem';
import { useGetData } from '@/hooks/data-hook';
import type { Post } from '@/types/content-types';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const { data, mutate } = useGetData<{ posts: Post[] }>(
    debouncedSearchQuery ? `search/${debouncedSearchQuery}` : null,
    { revalidateOnMount: false }
  );

  const router = useRouter();

  useEffect(() => {
    if (debouncedSearchQuery) {
      mutate();
    }
  }, [debouncedSearchQuery]);

  const searchChangeHandler = (event: React.SyntheticEvent, value: string) => {
    setSearchQuery(value);
  };

  const searchSubmintHandler = (event: FormEvent) => {
    event.preventDefault();
    if (!searchQuery || searchQuery.length === 0) {
      return;
    }
    router.push({
      pathname: '/search',
      query: { search: searchQuery },
    });
  };

  return (
    <form
      style={{ display: 'flex', gap: '1rem' }}
      onSubmit={searchSubmintHandler}
    >
      <Autocomplete
        sx={{
          flexGrow: 1,
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            border: '2px solid var(--main-theme-color)',
            borderRadius: 0,
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '2px solid var(--main-theme-color)',
            borderRadius: 0,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'var(--main-color-theme)',
          },
        }}
        freeSolo
        id="search"
        onInputChange={searchChangeHandler}
        disableClearable
        options={data?.posts || []}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.title
        }
        renderOption={(params, option) => (
          <ListItem {...params}>
            <Link
              style={{
                display: 'block',
                width: '100%',
                textDecoration: 'none',
              }}
              href={`/${option?.topics && option.topics[0].slug}/${
                option.slug
              }`}
            >
              {option.title}
            </Link>
          </ListItem>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Пошук"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
      <Button
        sx={{
          border: '2px solid var(--main-theme-color)',
          borderRadius: 0,
          color: 'var(--main-theme-color)',
        }}
        type="submit"
      >
        Пошук
      </Button>
    </form>
  );
}
