"use server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { api } from "@/api";
import { type SessionData, sessionOptions } from "@/lib/session/session.config";
import logger from "@/logger";
import { ERROR_MESSAGE } from "@/utils/constants/messages";

type ReturnedData = {
	error: boolean;
	success: boolean;
	message: string;
	redirect?: string;
};

export async function loginAction(
	_state: ReturnedData,
	data: FormData,
): Promise<ReturnedData> {
	try {
		const result = await api.auth.login({
			email: data.get("email") as string,
			password: data.get("password") as string,
		});

		const session = await getIronSession<SessionData>(
			await cookies(),
			sessionOptions,
		);
		session.user = {
			id: result.user.id,
			firstname: result.user.firstname,
			lastname: result.user.lastname,
			role: result.user.role,
			status: result.user.status,
		};
		session.token = result.token;
		session.refreshToken = result.refreshToken;
		session.tokenExpires = result.tokenExpires;
		await session.save();

		return {
			success: true,
			error: false,
			message: "Success",
		};
	} catch (error: unknown) {
		logger.error(
			error instanceof Error ? error.message : JSON.stringify(error),
		);

		return {
			error: true,
			success: false,
			message: ERROR_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD,
		};
	}
}
