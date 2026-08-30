
const publicApi = process.env.NEXT_PUBLIC_API_SERVER;
const baseApi =
	typeof window === "undefined"
		? process.env.API_SERVER_INTERNAL || process.env.API_SERVER || publicApi
		: publicApi;

if (!baseApi) {
	throw new Error(
		"API base URL is not configured. Set NEXT_PUBLIC_API_SERVER or API_SERVER.",
	);
}

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
