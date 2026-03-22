import { Suspense } from "react";
import SignIn from "@/app/auth/components/SignIn";
import Forgot from "../components/Forgot";

type Props = {
	searchParams: Promise<{
		forgotPassword?: string;
	}>;
};
export default async function LoginPage(props: Props) {
	const searchParams = await props.searchParams;
	const { forgotPassword } = searchParams;
	return (
		<Suspense>
			{!forgotPassword && <SignIn />}
			{forgotPassword && <Forgot />}
		</Suspense>
	);
}
