import { useState, ChangeEvent, SyntheticEvent, useEffect, useCallback, useMemo } from 'react';

interface UseTopicAgr {
  initTitle?: string;
  initSlug?: string;
  initDescription?: string;
  initActiveStatus?: boolean;
  initImage?: string;
  initCategories?: {name: string; id: number}[];
  initParentTopic?: {title: string; id: number};
}

export default function useTopic({
  initTitle,
  initSlug,
  initDescription,
  initActiveStatus,
  initImage,
  initCategories,
  initParentTopic,
}: UseTopicAgr = {}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(initTitle || '');
  const [slug, setSlug] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [activeStatus, setActiveStatus] = useState(false);
  const [image, setImage] = useState<File | null | string>(null);
  const [parentTopic, setParentTopic] = useState<{ title: string, id: number } | null>(null);
  const [categories, setCategories] = useState<{ name: string, id: number }[] | null>(null);


  useEffect(() => {
    initTitle && setTitle(initTitle);
    initSlug && setSlug(initSlug);
    initDescription && setDescription(initDescription);
    initActiveStatus && setActiveStatus(initActiveStatus);
    initImage && setImage(initImage);
    initCategories && setCategories(initCategories);
    initParentTopic && setParentTopic(initParentTopic);
  }, [initTitle, initSlug, initDescription, initActiveStatus, initImage, initCategories, initParentTopic]);

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
    (event: SyntheticEvent, value: any) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      value && setParentTopic(value);
    },
    []
  );

  const categoryChangeHandler = useCallback((event: SyntheticEvent, value: any) => {
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
      titleChangeHandler,
      descriptionChangeHandler,
      slugChangeHandler,
      setActiveStatus,
      parentTopicChangeHandler,
      categoryChangeHandler,
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
