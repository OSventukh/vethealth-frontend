
export interface EditorValue {
  content: string;
  title?: string;
  slug: string;
  categories: { id: number, name: string }[] | null;
  topics: { id: number, title: string }[] | null;
  status: 'published' | 'draft';
}

export interface EditorProps {
  onSave: (status: 'published' | 'draft') => void;
  content: string;
  categories: { id: number, name: string }[] | null;
  topics: { id: number, title: string }[] | null;
  slug: string;
  contentChangeHandler: (value: any) => void;
  categoriesChangeHandler: (value: { id: number, name: string }[]) => void;
  topicsChangeHandler: (value: { id: number, title: string }[]) => void;
  slugChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
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

export interface EditorToolbarProps {
  onSave: () => void;
  onSaveDraft: () => void;
  onSlug: Dispatch<SetStateAction<string>>;
  onCategories: Dispatch<SetStateAction<number[]>>;
  onTopics: Dispatch<SetStateAction<number[]>>;
  initTopics?: Topic[] | null;
  initCategories?: Category[] | null;
  initSlug?: string;
}