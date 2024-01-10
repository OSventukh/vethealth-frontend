export type Relation = { id: string };

export type Pagination<Model> = {
  items: Model[];
  totalPages: number;
  count: number;
  currentPage: number;
};

export type Status = {
  id: string;
  name: string;
};

export type Image = {
  id: string;
  path: string;
};
