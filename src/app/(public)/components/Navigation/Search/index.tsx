'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { searchSchema, SearchValues } from '@/utils/validators/form.validator';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostResponse } from '@/api/types/posts.type';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { ParsedContent } from '@/components/dashboard/Editor/ParsedContent';
import Link from 'next/link';
import { set } from 'zod';
import { LoadingSpinner } from '@/components/ui/custom/loading';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const router = useRouter();

  const form = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    mode: 'onChange',
    defaultValues: {
      query: '',
    },
  });


  const submitForm = async (values: SearchValues) => {
    const { query } = values;
    if (!query || query.trim() === '') return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  const getSearchResults = async (query: string) => {
    try {
      if (query.trim() === '') return;
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}/search?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortControllerRef.current.signal,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка пошуку');
      }

      if (data.count > 0) {
        setSearchResults(data.items);
      } else {
        setSearchResults([]);
      }
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Запит було скасовано');
      } else {
        console.error('Error fetching search results:', error);
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      getSearchResults(debouncedQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Search />
        </SheetTrigger>
        <SheetContent side="top" className="px-0">
          <div className="container">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submitForm)}
                className="flex flex-col gap-2 sm:gap-4"
              >
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пошук:</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Пошук"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setQuery(e.target.value);
                            }}
                          />
                        </FormControl>
                        <div>
                          <Button variant="ghost" type="submit">
                            <Search />
                          </Button>
                        </div>
                      </div>
                      <div className="h-2">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                ></FormField>
              </form>
            </Form>

            {loading && (
              <div className="flex justify-center">
                <div className="h-[24px] w-[24px]">
                  <LoadingSpinner />
                </div>
              </div>
            )}
            {searchResults.length > 0 && !loading && (
              <>
                <hr />
                <ul className="w-100 mt-4 max-h-[calc(100vw+6rem)] space-y-2 overflow-y-auto">
                  {searchResults.map((item) => (
                    <li key={item.id}>
                      <SheetClose asChild>
                        <Link href={`/${item.topics![0].slug}/${item.slug}`}>
                          <Card className="overflow-hidden">
                            <div className="flex">
                              <div className="p-2">
                                <h3 className="text-lg">{item.title}</h3>
                                <div>
                                  <ParsedContent
                                    content={JSON.parse(item.content)}
                                    excerpt
                                  />
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {!loading && query.length >= 3 && searchResults.length === 0 && (
              <>
              <hr />
              <div className='mt-2'>Результатів немає</div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
