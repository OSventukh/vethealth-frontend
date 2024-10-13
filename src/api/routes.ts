const { NEXT_PUBLIC_API_SERVER, API_SERVER } = process.env;

const baseApi = NEXT_PUBLIC_API_SERVER || API_SERVER;

export const routes = {
  topics: `${baseApi}/topics`,
  categories: `${baseApi}/categories`,
  posts: `${baseApi}/posts`,
  pages: `${baseApi}/pages`,
  users: `${baseApi}/users`,
  fileUpload: `${baseApi}/files/upload`,

  register: `${baseApi}/auth/register`,
  login: `${baseApi}/auth/login`,
  logout: `${baseApi}/auth/logout`,
  confirm: `${baseApi}/auth/confirm`,
  refresh: `${baseApi}/auth/refresh`,
  forgot: `${baseApi}/auth/forgot-password`,
  search: `${baseApi}/search`,
} as const;
