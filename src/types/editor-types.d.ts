import { SetStateAction } from "react";

export interface EditorValue {
  content: string;
  title?: string;
  slug: string;
  categories: Category[] | null;
  topics: Topic[] | null;
  status: 'published' | 'draft';
}

export interface EditorProps {
  onSave: (status: 'published' | 'draft') => void;
  content: string;
  title: string;
  categories?: Category[] | null;
  topics?: Topic[] | null;
  topic?: Topic | null;
  slug: string;
  parentPage?: Page | null;
  titleChangeHandler: (event: ChangeEvent) => void
  contentChangeHandler: (value: string, editor: Editor) => void;
  categoriesChangeHandler: (value: Category[]) => void;
  topicsChangeHandler?: (value: Topic[]) => void;
  topicChangeHandler?: (value: Topic) => void;
  slugChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  parentPageChangeHandler?: (value: Page) => void;
  isPage?: boolean
}

export type Category = {
  id: number;
  name: string;
  parentId: number;
  parent?: Category;
  children?: Category[];
}

export type Topic = {
  id: number;
  title: string;
  parentId: number;
  parent?: Topic;
  children?: Topic[];
}

export type Page = {
  id: number;
  title: string;
  parentId: number;
  parent: Page;
  children: Page[];
}

export interface EditorToolbarProps {
  onSave: () => void;
  onSaveDraft: () => void;
  onSlug: Dispatch<SetStateAction<string>>;
  onCategories?: Dispatch<SetStateAction<number[]>>;
  onTopics: Dispatch<SetStateAction<number[]>>;
  onTopic: Dispatch<SetStateAction<number>>;
  onParentPages?: Dispatch<SetStateAction<number[]>>;
  initTopics?: Topic[] | null;
  initTopic?: Topic | null;
  initCategories?: Category[] | null;
  initSlug?: string;
  initParentPage?: Page | null;
  isPage?: boolean;
}

export interface UseEditorAgr {
  initTitle?: string;
  initContent?: string;
  initSlug?: string;
  initTopic?: Topic | null;
  initParentPage?: Page | null;
  initTopics?: Topic[] | null;
  initCategories?: Category[] | null;
}