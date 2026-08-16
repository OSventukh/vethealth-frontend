import Link from "next/link";

type Props = {
	currentPage: number;
	totalPages: number;
	basePath: string;
	category?: string;
};

function pageHref(basePath: string, page: number, category?: string) {
	const params = new URLSearchParams();
	if (category) {
		params.set("category", category);
	}
	if (page > 1) {
		params.set("page", String(page));
	}
	const queryString = params.toString();
	return queryString ? `${basePath}?${queryString}` : basePath;
}

// Вікно сторінок: 1 … n-1 n n+1 … total (без дублів, з "…" у розривах)
function pageWindow(current: number, total: number): (number | "gap")[] {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1);
	}
	const pages = [
		...new Set(
			[1, current - 1, current, current + 1, total].filter(
				(page) => page >= 1 && page <= total,
			),
		),
	].toSorted((a, b) => a - b);

	const result: (number | "gap")[] = [];
	for (const [i, page] of pages.entries()) {
		if (i > 0 && page - (pages[i - 1] as number) > 1) {
			result.push("gap");
		}
		result.push(page);
	}
	return result;
}

const linkClass =
	"border-border flex h-10 min-w-10 items-center justify-center rounded-lg border bg-white px-3 transition-colors hover:bg-gray-100";

export default function PaginationNav({
	currentPage,
	totalPages,
	basePath,
	category,
}: Props) {
	if (totalPages <= 1) {
		return null;
	}

	return (
		<nav
			aria-label="Сторінки списку"
			className="my-8 flex flex-wrap items-center justify-center gap-2"
		>
			{currentPage > 1 && (
				<Link
					href={pageHref(basePath, currentPage - 1, category)}
					className={linkClass}
					rel="prev"
				>
					←
				</Link>
			)}
			{pageWindow(currentPage, totalPages).map((page, i) =>
				page === "gap" ? (
					// eslint-disable-next-line react/no-array-index-key
					<span key={`gap-${i}`} className="px-1 text-gray-400">
						…
					</span>
				) : page === currentPage ? (
					<span
						key={page}
						aria-current="page"
						className="border-border flex h-10 min-w-10 items-center justify-center rounded-lg border bg-gray-900 px-3 text-white"
					>
						{page}
					</span>
				) : (
					<Link
						key={page}
						href={pageHref(basePath, page, category)}
						className={linkClass}
					>
						{page}
					</Link>
				),
			)}
			{currentPage < totalPages && (
				<Link
					href={pageHref(basePath, currentPage + 1, category)}
					className={linkClass}
					rel="next"
				>
					→
				</Link>
			)}
		</nav>
	);
}
