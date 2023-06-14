import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ChangeEvent,
} from 'react';

import { Editor } from '@tinymce/tinymce-react';
import type { UseEditorAgr, Topic, Category, Page } from '@/types/editor-types';

export default function useEditor({
  initContent,
  initTitle,
  initSlug,
  initTopics,
  initTopic,
  initParentPage,
  initCategories,
}: UseEditorAgr = {}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [categories, setCategories] = useState<Category[]| null>(null);
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [parentPage, setParentPage] = useState<Page | null>(null)

  useEffect(() => {
    initTitle && setTitle(initTitle);
    initContent && setContent(initContent);
    initSlug && setSlug(initSlug);
    initTopics && setTopics(initTopics);
    initCategories && setCategories(initCategories);
    initTopic && setTopic(initTopic);
    initParentPage && setParentPage(initParentPage);
  }, [initTitle, initContent, initSlug, initTopics, initTopic, initCategories, initParentPage]);

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
    console.log('value', value)
    removeMessages();
    setContent(value);
  }, []);

  const slugChangeHandler = useCallback(
    (value: string) => {
      removeMessages();
      setSlug(value);
    }, []);

  const topicsChangeHandler = useCallback((value: Topic[]) => {
    setTopics(value)
  }, []);

  const topicChangeHandler = useCallback((value: Topic) => {
    setTopic(value)
  }, []);

  const categoriesChangeHandler = useCallback((value: Category[]) => {
    setCategories(value);
  }, []);

  const parentPageChangeHandler = useCallback((value: Page) => {
    setParentPage(value)
  }, []);

  const value = useMemo(
    () => ({
      title,
      content,
      slug,
      topics,
      topic,
      categories,
      parentPage,
      titleChangeHandler,
      contentChangeHandler,
      slugChangeHandler,
      topicsChangeHandler,
      topicChangeHandler,
      categoriesChangeHandler,
      parentPageChangeHandler,
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
      topic,
      categories,
      parentPage,
      titleChangeHandler,
      contentChangeHandler,
      slugChangeHandler,
      topicsChangeHandler,
      topicChangeHandler,
      parentPageChangeHandler,
      categoriesChangeHandler,
      successMessage,
      setSuccessMessage,
      errorMessage,
      setErrorMessage,
    ]
  );

  return value;
}
