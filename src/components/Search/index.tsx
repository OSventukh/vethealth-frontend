import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import useDebounce from '@/hooks/debounce-hook';
import { useGetData } from '@/hooks/data-hook';
import SearchButton from './SearchButton';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
import classes from './Search.module.css';
import { useOutsideClick } from '@/hooks/outside-click-hook';


import type { Post, PaginateData } from '@/types/content-types';
import { Config } from '@/utils/constants/config.enum';

function getPostUrl(post: Post) {
  return `/${post?.topics && post.topics[0].slug}/${post.slug}`;
}

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
  const showAllResultButton: boolean = data?.totalPages ? data.totalPages > 1 : false;
  return (
    <form className={classes.search} onSubmit={searchSubmintHandler} ref={ref} role="search">
      <SearchInput value={searchQuery} onChange={searchChangeHandler} />
      <SearchButton />
      <SearchResult<Post> searchData={data?.posts} anchorFn={getPostUrl} showAllResultButton={showAllResultButton} />
    </form>
  );
}
