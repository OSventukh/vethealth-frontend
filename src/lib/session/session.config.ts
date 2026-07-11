import type { SessionOptions } from "iron-session";
import type { UserSession } from "@/utils/types/user.type";

export interface SessionData {
	user: UserSession;
	token: string;
	refreshToken: string;
	tokenExpires: number;
}

export const sessionOptions: SessionOptions = {
	// iron-session requires a password of at least 32 characters to encrypt the
	// cookie. Reuse the existing auth secret (renamed NEXTAUTH_SECRET -> AUTH_SECRET).
	password: process.env.AUTH_SECRET as string,
	cookieName: "vethealth_session",
	// Seal TTL — kept explicit (and equal to cookie maxAge) because the proxy
	// re-seals the session with `sealData({ ttl: sessionOptions.ttl })` on refresh.
	ttl: 60 * 60 * 24 * 7,
	cookieOptions: {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		// Match the backend refresh-token TTL (7d) so the cookie lifetime tracks
		// the longest-lived token it carries.
		maxAge: 60 * 60 * 24 * 7,
	},
};
