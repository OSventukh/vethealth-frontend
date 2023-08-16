import Link from 'next/link';
import Button from '@mui/material/Button';
import classes from './Search.module.css';


export default function SearchResult<T extends { id: string; slug: string; title: string }>({
  searchData,
  anchorFn,
  showAllResultButton,
}: {
  searchData: T[] | null | undefined;
  anchorFn: (data: T) => string;
  showAllResultButton: boolean;
}) {
  return (
    <>
      {searchData && searchData.length > 0 && (
        <div className={classes['search-result']}>
          <ul>
            {searchData.map((post) => (
              <li key={post.id}>
                <Link
                  href={anchorFn(post)}
                >
                  {post.title}
                </Link>
              </li>
            ))}
            {showAllResultButton && (
              <Button sx={{ width: '100%' }} type="submit">
                Всі результати
              </Button>
            )}
          </ul>
        </div>
      )}
      {!searchData || searchData.length === 0 && (
        <div className={classes['search-result']}>
          <p>Результатів не знайдено</p>
        </div>
      )}
    </>
  );
}
