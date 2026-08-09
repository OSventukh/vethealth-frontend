import { Suspense } from "react";
import SignIn from "@/app/auth/components/SignIn";
import Forgot from "../components/Forgot";
import AuthCardFallback from "../components/ui/AuthCardFallback";

type Props = {
	searchParams: Promise<{
		forgotPassword?: string;
	}>;
};

async function LoginForm({ searchParams }: Props) {
	const { forgotPassword } = await searchParams;
	return forgotPassword ? <Forgot /> : <SignIn />;
}

export default function LoginPage(props: Props) {
	return (
		<Suspense fallback={<AuthCardFallback />}>
			<LoginForm searchParams={props.searchParams} />
		</Suspense>
	);
}
