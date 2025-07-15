'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sheet,
  SheetTitle,
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
import { ParsedContent } from '@/app/(dashboard)/admin/components/Editor/ParsedContent';
import { LoadingSpinner } from '@/components/ui/custom/loading';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
        console.error('Запит було скасовано');
      } else {
        console.error('Error fetching search results:', error);
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

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
        <SheetTrigger className="cursor-pointer p-2 md:p-4" title="Пошук">
          <Search />
        </SheetTrigger>
        <VisuallyHidden asChild>
          <SheetTitle>Пошук</SheetTitle>
        </VisuallyHidden>
        <SheetContent side="top" className="bg-[rgb(180,239,232)] px-0">
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
                            className="bg-background/80 border-none"
                            placeholder="Пошук"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setQuery(e.target.value);
                            }}
                          />
                        </FormControl>
                        <div>
                          <Button
                            className="aspect-square cursor-pointer p-1"
                            variant="default"
                            type="submit"
                          >
                            <Search size={20} />
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
                <div className="h-[1px] w-full bg-white" />
                <ul className="mt-4 max-h-[calc(100vw+6rem)] w-full space-y-2 overflow-y-auto">
                  {searchResults.map((item) => (
                    <li key={item.id}>
                      <SheetClose asChild>
                        <Link href={`/${item.topics![0].slug}/${item.slug}`}>
                          <Card className="overflow-hidden border-none">
                            <div className="flex">
                              <div className="p-2">
                                <h2 className="text-lg">{item.title}</h2>
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
                <div className="h-[1px] w-full bg-white" />
                <div className="mt-2">Результатів немає</div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
