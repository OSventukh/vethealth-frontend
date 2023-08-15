import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useDebounce from '@/hooks/debounce-hook';
import { useGetData } from '@/hooks/data-hook';
import classes from './Search.module.css';
import SearchIcon from '@mui/icons-material/Search';
import { useOutsideClick } from '@/hooks/outside-click-hook';
import Button from '@mui/material/Button';
import type { Post, PaginateData } from '@/types/content-types';
import { Config } from '@/utils/constants/config.enum';

export default function CustomSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, mutate } = useGetData<PaginateData & {posts: Post[] }>(
    searchQuery.length > 2 && debouncedSearchQuery
      ? `search/${debouncedSearchQuery}?size=${Config.NumResultsSearchAutocomplete}&page=1`
      : null,
    { revalidateOnMount: false }
  );

  const router = useRouter();

  useEffect(() => {
    if (debouncedSearchQuery) {
      mutate();
    }
  }, [debouncedSearchQuery]);

  const searchChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
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

  const clearSearchInput = () => {
    setSearchQuery('');
  };

  const ref = useOutsideClick(clearSearchInput);

  return (
    <form className={classes.search} onSubmit={searchSubmintHandler} ref={ref}>
      <input
        value={searchQuery}
        type="text"
        className={classes.input}
        placeholder="Пошук..."
        required
        onChange={searchChangeHandler}
      />
      <Button className={classes.submit} type="submit">
        <SearchIcon />
      </Button>
      {data?.posts && data.posts.length > 0 && (
        <div className={classes['search-result']}>
          <ul>
            
            {data.posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/${post?.topics && post.topics[0].slug}/${post.slug}`}
                >
                  {post.title}
                </Link>
              </li>
            ))}
            {data.totalPages > 1 && <Button sx={{ width: '100%'}} type="submit">Всі результати</Button>}
          </ul>
        </div>
      )}
      {data?.posts && data.posts.length === 0 && (
        <div className={classes['search-result']}>
          <p>Результатів не знайдено</p>
        </div>
      )}
    </form>
  );
}
