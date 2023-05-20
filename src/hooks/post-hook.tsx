import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ChangeEvent,
} from 'react';

import { Editor } from '@tinymce/tinymce-react';
interface UsePostAgr {
  initTitle?: string;
  initContent?: string;
  initSlug?: string;
  initTopics?: { title: string; id: number; parentId: number }[] | null;
  initCategories?: { name: string; id: number; parentId: number }[] | null;
}

export default function usePost({
  initContent,
  initTitle,
  initSlug,
  initTopics,
  initCategories,
}: UsePostAgr = {}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [categories, setCategories] = useState<{ name: string, id: number, parentId: number}[]| null>(null);
  const [topics, setTopics] = useState<{ title: string, id: number, parentId: number }[] | null>(null);

  useEffect(() => {
    initTitle && setTitle(initTitle);
    initContent && setContent(initContent);
    initSlug && setSlug(initSlug);
    initTopics && setTopics(initTopics);
    initCategories && setCategories(initCategories);
  }, [initTitle, initContent, initSlug, initTopics, initCategories]);

  const removeMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const titleChangeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    removeMessages();
    const value = event.target.value;
    setTitle(value);
  }, []);

  const contentChangeHandler = useCallback((value: any, editor: Editor) => {
    removeMessages();
    setContent(value);
  }, []);

  const slugChangeHandler = useCallback(
    (value: string) => {
      removeMessages();
      setSlug(value);
    }, []);

  const topicsChangeHandler = useCallback((value: {id: number, title: string, parentId: number}[]) => {
    setTopics(value)
  }, []);

  const categoriesChangeHandler = useCallback((value: {id: number, name: string, parentId: number}[]) => {
    setCategories(value);
  }, []);

  const value = useMemo(
    () => ({
      title,
      content,
      slug,
      topics,
      categories,
      titleChangeHandler,
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
      title,
      content,
      slug,
      topics,
      categories,
      titleChangeHandler,
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
