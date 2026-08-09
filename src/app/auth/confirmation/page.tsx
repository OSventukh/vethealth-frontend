import { redirect } from "next/navigation";
import { Suspense } from "react";
import { api } from "@/api";
import Confirmation from "../components/Confirmation";
import AuthCardFallback from "../components/ui/AuthCardFallback";

type Props = {
	searchParams: Promise<{
		hash: string;
	}>;
};

async function ConfirmationForm({ searchParams }: Props) {
	const { hash } = await searchParams;
	try {
		const user = await api.auth.getPendingUser(hash);
		if (!user) {
			redirect("/auth/login");
		}
		return <Confirmation user={user} token={hash} />;
	} catch {
		redirect("/auth/login");
	}
}

export default function ConfirmationPage(props: Props) {
	return (
		<Suspense fallback={<AuthCardFallback />}>
			<ConfirmationForm searchParams={props.searchParams} />
		</Suspense>
	);
}
