const baseApi = process.env.API_SERVER;

export const routes = {
  topics: `${baseApi}/topics`,
  posts: `${baseApi}/posts`,
  users: `${baseApi}/users`,
  fileUpload: `${baseApi}/files/upload`,

  register: `${baseApi}/auth/register`,
  login: `${baseApi}/auth/login`,
  logout: `${baseApi}/auth/logout`,
  confirm: `${baseApi}/auth/confirm`,
  refresh: `${baseApi}/auth/refresh`,
  forgot: `${baseApi}/auth/forgot-password`,
} as const;