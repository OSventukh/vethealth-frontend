const routes = {
  home: '/admin',
  topics: {
    all: '/admin/topics',
    new: '/admin/topics/new',
  },
  posts: {
    all: '/admin/posts',
    new: '/admin/posts/new',
    categories: '/admin/posts/categories',
    newCategory: '/admin/posts/categories/new',
  },
  pages: {
    all: '/admin/pages',
    new: '/admin/pages/new',
  },
  users: {
    all: '/admin/users',
    new: '/admin/users/new',
  },
  settings: {
    general: '/admin/settings',
  },
};

export default routes;