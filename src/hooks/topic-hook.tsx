// react imports
import { useState, ChangeEvent, SyntheticEvent, useEffect, useCallback, useMemo } from 'react';

// type imports
import type { Topic, Category, Page } from '@/types/content-types';
import type { UseTopic } from '@/types/props-types';

// constant imports
import { TopicContent } from '@/utils/constants/content.enum';

export default function useTopic({
  initTitle,
  initSlug,
  initDescription,
  initActiveStatus,
  initImage,
  initCategories,
  initParentTopic,
  initContent,
  initPage,
}: UseTopic = {}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(initTitle || '');
  const [slug, setSlug] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [activeStatus, setActiveStatus] = useState(false);
  const [image, setImage] = useState<File | null | string>(null);
  const [parentTopic, setParentTopic] = useState<Topic | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [content, setContent] = useState<TopicContent.Posts | TopicContent.Page>(TopicContent.Posts);
  const [page, setPage] = useState<Page | null>(null);

  useEffect(() => {
    initTitle && setTitle(initTitle);
    initSlug && setSlug(initSlug);
    initDescription && setDescription(initDescription);
    initActiveStatus && setActiveStatus(initActiveStatus);
    initImage && setImage(initImage);
    initCategories && setCategories(initCategories);
    initParentTopic && setParentTopic(initParentTopic);
    initPage && setPage(initPage);
    initContent && setContent(initContent);
  }, [initTitle, initSlug, initDescription, initActiveStatus, initImage, initCategories, initParentTopic, initPage, initContent]);

  const titleChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      const enteredTitle = event.target.value;
      setTitle(enteredTitle);
    },
    []
  );

  const slugChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      const enteredSlug = event.target.value;
      setSlug(enteredSlug);
    },
    []
  );

  const descriptionChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      const enteredDescription = event.target.value;
      setDescription(enteredDescription);
    },
    []
  );

  const parentTopicChangeHandler = useCallback(
    (event: SyntheticEvent, value: Topic) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      value && setParentTopic(value);
    },
    []
  );

  const pageChangeHandler = useCallback(
    (event: SyntheticEvent, value: Page) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      value && setPage(value);
    },
    []
  );

  const contentChangeHandler = useCallback(
    (event: SyntheticEvent, value: string) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      value && setContent(value as TopicContent);
    },
    []
  );

  const categoryChangeHandler = useCallback((event: SyntheticEvent, value: Category[]) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    value && setCategories(value);
  }, [])

  const clearInputs: () => void = useCallback(() => {
    setTitle('');
    setDescription('');
    setSlug('');
    setActiveStatus(false);
    setImage(null);
    setParentTopic(null);
  }, []);

  const value = useMemo(
    () => ({
      title,
      slug,
      description,
      activeStatus,
      image,
      parentTopic,
      categories,
      titleChangeHandler,
      descriptionChangeHandler,
      slugChangeHandler,
      parentTopicChangeHandler,
      categoryChangeHandler,
      setActiveStatus,
      setImage,
      page,
      content,
      pageChangeHandler,
      contentChangeHandler,
      clearInputs,
      successMessage,
      setSuccessMessage,
      errorMessage,
      setErrorMessage
    }),
    [
      title,
      slug,
      description,
      activeStatus,
      image,
      parentTopic,
      categories,
      page,
      content,
      titleChangeHandler,
      descriptionChangeHandler,
      slugChangeHandler,
      setActiveStatus,
      parentTopicChangeHandler,
      categoryChangeHandler,
      pageChangeHandler,
      contentChangeHandler,
      setImage,
      clearInputs,
      successMessage,
      setSuccessMessage,
      errorMessage,
      setErrorMessage
    ]
  );

  return value;
}
