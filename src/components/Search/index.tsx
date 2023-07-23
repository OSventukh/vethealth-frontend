import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useDebounce from '@/hooks/debounce-hook';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import ListItem from '@mui/material/ListItem';
import { useGetData } from '@/hooks/data-hook';
import type { Post } from '@/types/content-types';
import { IconButton } from '@mui/material';

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
      style={{ position: 'relative', width: '15rem', maxWidth: '100%'}}
      onSubmit={searchSubmintHandler}
    >
      <Autocomplete
    size='small'
        sx={{
          flexGrow: 1,
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            border: '1px solid var(--font-color)',
            borderRadius: '20px',
          },
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend': {
            display: 'none',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '1px solid var(--font-color)',
            borderRadius: '20px',
          },
          '& .MuiInputLabel-root': {
                color: 'var(--font-color)',

          },
          '& .MuiInputLabel-root.Mui-focused': {
            display: 'none',
            color: 'var(--font-color)',
          },
          '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
            mr: '2rem'
          }
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
      <IconButton
        sx={{
          position: 'absolute',
          right: '0.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--font-color)',
        
        }}
        size='small'
        type="submit"
      >
        <SearchIcon />
      </IconButton>
    </form>
  );
}
