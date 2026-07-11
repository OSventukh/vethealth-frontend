import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { type SessionData, sessionOptions } from "./session.config";

/**
 * Reads the iron-session cookie on the server. Returns `null` when there is no
 * active session, mirroring the old next-auth `getServerSession` contract so the
 * call sites (`session?.token`, `session?.user`) stay unchanged.
 *
 * Note: this only READS the session. Token rotation (refresh) happens in
 * `src/proxy.ts`, because cookies cannot be written during a Server Component
 * render in the App Router.
 */
export async function auth() {
	const session = await getIronSession<SessionData>(
		await cookies(),
		sessionOptions,
	);

	if (!session.token) {
		return null;
	}

	return session;
}
