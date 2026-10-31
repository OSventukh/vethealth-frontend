"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { listMediaAction } from "@/actions/media.action";
import type { Pagination } from "@/api/types/general.type";
import type { MediaItem } from "@/api/types/media.type";

const PAGE_SIZE = 40;
const SEARCH_DEBOUNCE_MS = 300;

export interface MediaFilters {
	search: string;
	missingAlt: boolean;
	unused: boolean;
	/** Лише вужчі за цю ширину (px); undefined — будь-які. */
	narrowerThan?: number;
}

const DEFAULT_FILTERS: MediaFilters = {
	search: "",
	missingAlt: false,
	unused: false,
};

/**
 * Список медіатеки з пошуком, фільтром «без alt» і довантаженням сторінок.
 * Локальні правки (завантаження, новий alt, видалення) вносяться в список
 * одразу, без перезапиту.
 */
export function useMediaList(initial?: Pagination<MediaItem>) {
	const [items, setItems] = useState<MediaItem[]>(initial?.items ?? []);
	const [count, setCount] = useState(initial?.count ?? 0);
	const [loading, setLoading] = useState(!initial);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<MediaFilters>(DEFAULT_FILTERS);
	// Відповідь застарілого запиту (користувач уже змінив пошук) відкидаємо.
	const requestId = useRef(0);
	const skipInitialFetch = useRef(Boolean(initial));

	/**
	 * `offset` — скільки вже показано (0 — з початку). Саме зсув, а не номер
	 * сторінки: після локальних завантажень/видалень межі серверних сторінок
	 * зсунулися, і `page + 1` дублював би або пропускав файли.
	 */
	const load = useCallback(async (offset: number, current: MediaFilters) => {
		const id = ++requestId.current;
		setLoading(true);
		setError(null);
		const result = await listMediaAction({
			offset,
			size: PAGE_SIZE,
			search: current.search,
			missingAlt: current.missingAlt,
			unused: current.unused,
			narrowerThan: current.narrowerThan,
		});
		if (id !== requestId.current) return;
		setLoading(false);
		if (!result.success) {
			setError(result.message);
			return;
		}
		const { items: pageItems, count: total } = result.data;
		setItems((previous) => {
			if (offset === 0) return pageItems;
			// Страховка від гонок (файл завантажили між запитами): без дублів.
			const shown = new Set(previous.map((item) => item.id));
			return [...previous, ...pageItems.filter((item) => !shown.has(item.id))];
		});
		setCount(total);
	}, []);

	useEffect(() => {
		if (skipInitialFetch.current) {
			skipInitialFetch.current = false;
			return;
		}
		const timer = setTimeout(
			() => load(0, filters),
			filters.search ? SEARCH_DEBOUNCE_MS : 0,
		);
		return () => clearTimeout(timer);
	}, [filters, load]);

	return {
		items,
		count,
		loading,
		error,
		filters,
		hasMore: items.length < count,
		setSearch: (search: string) =>
			setFilters((previous) => ({ ...previous, search })),
		setFilter: <Key extends keyof MediaFilters>(
			key: Key,
			value: MediaFilters[Key],
		) => setFilters((previous) => ({ ...previous, [key]: value })),
		loadMore: () => load(items.length, filters),
		reload: () => load(0, filters),
		prepend: (item: MediaItem) => {
			setItems((previous) => [item, ...previous]);
			setCount((previous) => previous + 1);
		},
		replace: (item: MediaItem) =>
			setItems((previous) =>
				previous.map((existing) =>
					existing.id === item.id ? { ...existing, ...item } : existing,
				),
			),
		remove: (id: string) => {
			setItems((previous) => previous.filter((item) => item.id !== id));
			setCount((previous) => Math.max(0, previous - 1));
		},
	};
}

export type MediaList = ReturnType<typeof useMediaList>;
