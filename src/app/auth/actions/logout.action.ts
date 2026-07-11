"use server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/api";
import { type SessionData, sessionOptions } from "@/lib/session/session.config";
import logger from "@/logger";

export async function logoutAction() {
	const session = await getIronSession<SessionData>(
		await cookies(),
		sessionOptions,
	);

	try {
		if (session.token) {
			await api.auth.logout(session.token);
		}
	} catch (error: unknown) {
		// The backend logout (soft-deleting the server-side session) may fail;
		// we still destroy the local cookie so the user is logged out client-side.
		logger.error(
			error instanceof Error ? error.message : JSON.stringify(error),
		);
	}

	session.destroy();
	redirect("/auth/login");
}
