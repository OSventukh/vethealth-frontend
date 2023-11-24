export type Relation = { id: string };

export type Pagination<Model> = {
  items: Model[];
  totalPages: number;
  count: number;
  currentPage: number;
};
