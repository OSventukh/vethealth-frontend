import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/DataTable/TableSkeleton";
import { auth } from "@/lib/session/auth";
import logger from "@/logger";
import { UserRoleEnum } from "@/utils/enums/user.enum";
import { SeoWorkspace } from "./components/seo-workspace";
import { buildSeoEntries, type SeoEntryResponse } from "./seo-fields";

const ADMIN_ROLES = new Set<string>([
	UserRoleEnum.SuperAdmininstrator,
	UserRoleEnum.Administrator,
]);

export default function SeoPage() {
	return (
		<Suspense fallback={<DataTableSkeleton columnCount={4} />}>
			<SeoContent />
		</Suspense>
	);
}

async function SeoContent() {
	const session = await auth();
	// Бекенд однаково відповість 403 — тут лише зрозуміле пояснення.
	if (!session?.user?.role || !ADMIN_ROLES.has(session.user.role.name)) {
		return (
			<p className="text-muted-foreground p-6">
				Масове SEO доступне лише адміністраторам.
			</p>
		);
	}

	const response = await fetch(`${process.env.API_SERVER}/seo/entries`, {
		headers: { Authorization: `Bearer ${session.token}` },
		cache: "no-store",
	});
	if (!response.ok) {
		logger.error(`SeoPage: backend responded ${response.status}`);
		return (
			<p className="text-destructive p-6">
				Не вдалося завантажити матеріали. Оновіть сторінку.
			</p>
		);
	}
	const entries = buildSeoEntries(
		(await response.json()) as SeoEntryResponse[],
	);

	return <SeoWorkspace initialEntries={entries} />;
}
