import { useState, ChangeEvent, SyntheticEvent, useEffect, useCallback, useMemo } from 'react';
import type { UseCategory } from '@/types/props-types';
import type { Category } from '@/types/content-types';


export default function useTopic({
  initName,
  initSlug,
  initParentCategory
}: UseCategory = {}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [parentCategory, setParentCategory] = useState<Category | null>(null);

  useEffect(() => {
    initName && setName(initName);
    initSlug && setSlug(initSlug);
    initParentCategory && setParentCategory(initParentCategory);
  }, [initName, initSlug, initParentCategory]);

  const nameChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      const enteredName = event.target.value;
      setName(enteredName);
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

  const parentCategoryChangeHandler = useCallback(
    (event: SyntheticEvent, value: any) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      value && setParentCategory(value);
    },
    []
  );

  const clearInputs: () => void = useCallback(() => {
    setName('');
    setParentCategory(null);
    setSlug('');
  }, []);

  const value = useMemo(
    () => ({
      name,
      slug,
      parentCategory,
      nameChangeHandler,
      parentCategoryChangeHandler,
      slugChangeHandler,
      clearInputs,
      successMessage,
      setSuccessMessage,
      errorMessage,
      setErrorMessage
    }),
    [
      name,
      slug,
      parentCategory,
      nameChangeHandler,
      parentCategoryChangeHandler,
      slugChangeHandler,
      clearInputs,
      successMessage,
      setSuccessMessage,
      errorMessage,
      setErrorMessage
    ]
  );

  return value;
}
