import { TopicContent } from "@/utils/constants/content.enum";
import { HeadCell } from "./ui-types";

export interface ChildrenProps {
  children: ReactElement,
}

export interface NavigationProps {
  open: boolean;
  handleDrawerToggle?: () => void;
}

export interface NavIconProps {
  open: boolean;
  link: string;
  icon?: ReactElement;
  onClick?: (event: React.MouseEvent) => void;
  children: string;
  expandIcon?: ReactElement;
  selected?: boolean;
  nested?: boolean
}

export interface ItemsTableProps {
  url: string;
  query?: string;
  title: string;
  header: HeadCell[]
}

export interface UseTopic {
  initTitle?: string;
  initSlug?: string;
  initDescription?: string;
  initActiveStatus?: boolean;
  initImage?: string;
  initCategories?: Category[];
  initParentTopic?: Topic;
  initPage?: Page;
}

export interface EditTopic {
  title?: string;
  slug?: string;
  description?: string;
  activeStatus?: boolean;
  image: string | File | null;
  page: Page;
  content: TopicContent;
  parentTopic: { title: string; id: number } | null;
  categories: { name: string; id: number }[] | null;
  titleChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  slugChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  descriptionChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  setImage: Dispatch<SetStateAction<string | File | null>>;
  setActiveStatus: Dispatch<SetStateAction<boolean>>;
  topicSubmitHandler: (event: React.SyntheticEvent) => void;
  categoryChangeHandler: (event: React.SyntheticEvent, value: Category) => void;
  parentTopicChangeHandler: (event: React.SyntheticEvent, value: Topic) => void;
  pageChangeHandler: (event: React.SyntheticEvent, value: Page) => void;
  contentChangeHandler: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
  successMessage?: string | null;
  errorMessage?: string | null;
  buttonText?: string;
  edit?: boolean;
}