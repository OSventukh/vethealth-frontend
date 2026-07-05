import { signIn } from "next-auth/react";
import logger from "@/logger";
import { ERROR_MESSAGE } from "@/utils/constants/messages";

type ReturnedData = {
	error: boolean;
	success: boolean;
	message: string;
	redirect?: string;
};

export async function loginAction(
	state: ReturnedData,
	data: FormData,
): Promise<ReturnedData> {
	try {
		const res = await signIn("credentials", {
			email: data.get("email") as string,
			password: data.get("password") as string,
			redirect: false,
		});

		if (res?.error) {
			return {
				error: true,
				success: false,
				message: ERROR_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD,
			};
		}
		return {
			success: true,
			error: false,
			message: "Success",
		};
	} catch (error: unknown) {
		let message = "Щось пішло не так";
		logger.error(
			error instanceof Error ? error.message : JSON.stringify(error),
		);

		return {
			error: true,
			success: false,
			message,
		};
	}
}
