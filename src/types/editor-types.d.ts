
export interface EditorValue {
  content?: string;
  slug?: string;
  categories?: number[];
  topics?: number[];
  status?: 'published' | 'draft';
}

export interface EditorProps {
  onSave: ({}: EditorValue) => void;
  initValue?: EditorValue;
}

export interface EditorToolbarProps {
  onSave: () => void;
  onSaveDraft: () => void;
  onSlug: Dispatch<SetStateAction<string>>;
  onCategories: Dispatch<SetStateAction<number[]>>;
  onTopics: Dispatch<SetStateAction<number[]>>;
  initTopics?: number[];
  initCategories?: number[];
  initSlug?: string;
}