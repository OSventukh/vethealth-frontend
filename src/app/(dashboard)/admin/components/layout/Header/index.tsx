import Link from "next/link";
import UserMenu from "@/app/(dashboard)/admin/users/components/UserMenu";
import Logo from "@/components/logo";
import { auth } from "@/lib/next-auth/auth";

type Props = {
	className?: string;
};

export default async function Header({ className }: Props) {
	const session = await auth();
	return (
		<div className={className}>
			<div className="flex h-full w-full items-center justify-between">
				<Link href="/admin">
					<Logo />
				</Link>
				<UserMenu userId={session?.user.id} />
			</div>
		</div>
	);
}
