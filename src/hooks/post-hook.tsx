import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

interface UsePostAgr {
  initContent?: string;
  initSlug?: string;
  initTopics?: { title: string; id: number }[] | null;
  initCategories?: { name: string; id: number }[] | null;
}

export default function usePost({
  initContent,
  initSlug,
  initTopics,
  initCategories,
}: UsePostAgr = {}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [categories, setCategories] = useState<{ name: string, id: number}[]| null>(null);
  const [topics, setTopics] = useState<{ title: string, id: number }[] | null>(null);

  useEffect(() => {
    initContent && setContent(initContent);
    initSlug && setSlug(initSlug);
    initTopics && setTopics(initTopics);
    initCategories && setCategories(initCategories);
  }, [initContent, initSlug, initTopics, initCategories]);

  const contentChangeHandler = useCallback((value: any) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setContent(value);
  }, []);

  const slugChangeHandler = useCallback(
    (value: string) => {
      setErrorMessage(null);
      setSuccessMessage(null);
      setSlug(value);
    },
    []
  );

  const topicsChangeHandler = useCallback((value: {id: number, title: string}[]) => {
    setTopics(value)
  }, []);

  const categoriesChangeHandler = useCallback((value: {id: number, name: string}[]) => {
    setCategories(value);
  }, []);

  const value = useMemo(
    () => ({
      content,
      slug,
      topics,
      categories,
      contentChangeHandler,
      slugChangeHandler,
      topicsChangeHandler,
      categoriesChangeHandler,
      successMessage,
      setSuccessMessage,
      errorMessage,
      setErrorMessage,
    }),
    [
      content,
      slug,
      topics,
      categories,
      contentChangeHandler,
      slugChangeHandler,
      topicsChangeHandler,
      categoriesChangeHandler,
      successMessage,
      setSuccessMessage,
      errorMessage,
      setErrorMessage,
    ]
  );

  return value;
}
