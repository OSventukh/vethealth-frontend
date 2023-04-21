import { useState, ChangeEvent, useEffect, useCallback, useMemo } from 'react';

interface UseTopicAgr {
  initTitle?: string;
  initSlug?: string;
  initDescription?: string;
  initActiveStatus?: boolean;
  initImage?: string;
}

export default function useTopic({
  initTitle,
  initSlug,
  initDescription,
  initActiveStatus,
  initImage,
}: UseTopicAgr = {}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(initTitle || '');
  const [slug, setSlug] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [activeStatus, setActiveStatus] = useState(false);
  const [image, setImage] = useState<File | null | string>(null);

  useEffect(() => {
    initTitle && setTitle(initTitle);
    initSlug && setSlug(initSlug);
    initDescription && setDescription(initDescription);
    initActiveStatus && setActiveStatus(initActiveStatus);
    initImage && setImage(initImage);
  }, [initTitle, initSlug, initDescription, initActiveStatus, initImage]);

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

  const clearInputs: () => void = useCallback(() => {
    setTitle('');
    setDescription('');
    setSlug('');
    setActiveStatus(false);
    setImage(null);
  }, []);

  const value = useMemo(
    () => ({
      title,
      slug,
      description,
      activeStatus,
      image,
      titleChangeHandler,
      descriptionChangeHandler,
      slugChangeHandler,
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
      titleChangeHandler,
      descriptionChangeHandler,
      slugChangeHandler,
      setActiveStatus,
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
