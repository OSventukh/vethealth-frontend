import { TopicContent } from '@/utils/constants/content.enum';
import type { HeadCell } from './ui-types';
import type { Category, Topic } from './content-types';
import { Role } from './auth-types';

export interface ChildrenProps {
  children: ReactElement;
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
  nested?: boolean;
}

export interface ItemsTableProps {
  url: string;
  query?: string;
  title: string;
  header: HeadCell[];
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
  initContent?: TopicContent;
}

export interface UseCategory {
  initName?: string;
  initSlug?: string;
  initParentCategory?: Category | null;
}

export interface UseUser {
  initFirstname?: string;
  initLastname?: string | null;
  initEmail?: string;
  initStatus?: string;
  initTopics?: Topic[];
  initRole?: Role;
}
export interface EditTopic {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  activeStatus?: boolean;
  image: string | File | null;
  page: Page;
  content: TopicContent;
  parentTopic: Topic | null;
  childrenTopic?: Topic[];
  categories: Category[] | null;
  titleChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  slugChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  descriptionChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  setImage: Dispatch<SetStateAction<string | File | null>>;
  setActiveStatus: Dispatch<SetStateAction<boolean>>;
  topicSubmitHandler: (event: React.SyntheticEvent) => void;
  categoryChangeHandler: (
    event: React.SyntheticEvent,
    value: Category[]
  ) => void;
  parentTopicChangeHandler: (
    event: React.SyntheticEvent,
    value: Topic | null
  ) => void;
  pageChangeHandler: (event: React.SyntheticEvent, value: Page) => void;
  contentChangeHandler: (
    event: ChangeEvent<HTMLInputElement>,
    value: string
  ) => void;
  successMessage?: string | null;
  errorMessage?: string | null;
  buttonText?: string;
  edit?: boolean;
}

export interface EditCategory {
  id?: string;
  name?: string;
  slug?: string;
  parentCategory?: Category | null;
  childrenCategory?: Category[];
  nameChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  slugChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  parentCategoryChangeHandler: (event: FormEvent, value: any) => void;
  categorySubmitHandler: (event: FormEvent) => void;
  successMessage?: string | null;
  errorMessage?: string | null;
  buttonText?: string;
  edit?: boolean;
}

export interface EditUser {
  id?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  status: string;
  topics: Topic[] | null;
  role: Role | null;
  firstnameChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  lastnameChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  emailChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  statusChangeHandler: (event: SelectChangeEvent<string>) => void;
  changePasswordHandler?: () => void;
  topicsChangeHandler: (
    event: SyntheticEvent,
    value: Topic[] | null
  ) => void;
  roleChangeHandler: (
    event: SyntheticEvent,
    value: Role | null
  ) => void;
  userSubmit: (event: FormEvent) => void;
  successMessage: string | null;
  errorMessage: string | null;
  edit?: boolean;
}

export type General = {
  title: string;
  name: string;
  description: string;
};

export interface Header {
  general: General;
  navigationMenu: Category[] | null;
}

export type NavItemWithNested = {
  text: string;
  nested: Category[];
  anchor?: string;
};

export type NavItem = {
  text: string;
  link: string;
  nested?: boolean;
  anchor?: string;
};
