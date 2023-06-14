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