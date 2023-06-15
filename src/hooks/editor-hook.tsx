// react imports
import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';

// tinymce imports
import { Editor } from '@tinymce/tinymce-react';

// type imports
import type { UseEditorAgr } from '@/types/editor-types';
import type { Topic, Category, Page } from '@/types/content-types';

export default function useEditor({
  initContent,
  initTitle,
  initSlug,
  initTopics,
  initCategories,
}: UseEditorAgr = {}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [topics, setTopics] = useState<Topic[] | null>(null);

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

  const titleChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      removeMessages();
      const value = event.target.value;
      setTitle(value);
    },
    []
  );

  const contentChangeHandler = useCallback((value: any, editor: Editor) => {
    console.log('value', value);
    removeMessages();
    setContent(value);
  }, []);

  const slugChangeHandler = useCallback((value: string) => {
    removeMessages();
    setSlug(value);
  }, []);

  const topicsChangeHandler = useCallback((value: Topic[]) => {
    setTopics(value);
  }, []);

  const categoriesChangeHandler = useCallback((value: Category[]) => {
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
