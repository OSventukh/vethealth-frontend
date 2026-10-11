"use client";
import { useCallback, useEffect, useState } from "react";
import {
	SEO_FIELDS,
	type SeoDraft,
	type SeoEntry,
	type SeoField,
} from "./seo-fields";

// Згенероване ШІ коштує грошей і часу — випадкове оновлення сторінки не має
// його губити. Чернетки живуть у localStorage до збереження або скасування.
const STORAGE_KEY = "vethealth:seo-drafts";

type Drafts = Record<string, SeoDraft>;

/** Лишає з сирих даних лише відомі матеріали й поля з рядковими значеннями. */
export function sanitizeDrafts(raw: unknown, entries: SeoEntry[]): Drafts {
	if (!raw || typeof raw !== "object") {
		return {};
	}
	const byKey = new Map(entries.map((entry) => [entry.key, entry]));
	const drafts: Drafts = {};

	for (const [key, value] of Object.entries(raw)) {
		const entry = byKey.get(key);
		if (!entry || !value || typeof value !== "object") {
			continue;
		}
		const draft: SeoDraft = {};
		for (const field of SEO_FIELDS) {
			const fieldValue = (value as Record<string, unknown>)[field];
			// Чернетка, що збігається зі збереженим, — вже не чернетка.
			if (
				typeof fieldValue === "string" &&
				fieldValue !== (entry.metadata[field] ?? "")
			) {
				draft[field] = fieldValue;
			}
		}
		if (Object.keys(draft).length) {
			drafts[key] = draft;
		}
	}
	return drafts;
}

export function useSeoDrafts(entries: SeoEntry[]) {
	const [drafts, setDrafts] = useState<Drafts>({});
	const [restoredCount, setRestoredCount] = useState(0);
	// Стан, а не ref: ефект запису має побачити `loaded` лише разом з
	// відновленими чернетками. З ref він спрацьовував у тому ж коміті з
	// порожнім `drafts` і стирав сховище до відновлення (а в StrictMode
	// повторне читання вже знаходило порожнечу).
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		try {
			const stored = sanitizeDrafts(
				JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"),
				entries,
			);
			setDrafts(stored);
			setRestoredCount(Object.keys(stored).length);
		} catch {
			localStorage.removeItem(STORAGE_KEY);
		}
		setLoaded(true);
		// Лише при монтуванні: далі джерело правди — стан, а не сховище.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!loaded) {
			return;
		}
		if (Object.keys(drafts).length) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
		} else {
			localStorage.removeItem(STORAGE_KEY);
		}
	}, [drafts, loaded]);

	/** Ставить значення полів; збіг зі збереженим прибирає поле з чернетки. */
	const setFields = useCallback((entry: SeoEntry, values: SeoDraft) => {
		setDrafts((current) => {
			const draft = { ...current[entry.key] };
			for (const [field, value] of Object.entries(values) as [
				SeoField,
				string,
			][]) {
				if (value === (entry.metadata[field] ?? "")) {
					delete draft[field];
				} else {
					draft[field] = value;
				}
			}
			const next = { ...current };
			if (Object.keys(draft).length) {
				next[entry.key] = draft;
			} else {
				delete next[entry.key];
			}
			return next;
		});
	}, []);

	const revertField = useCallback((entry: SeoEntry, field: SeoField) => {
		setDrafts((current) => {
			const draft = { ...current[entry.key] };
			delete draft[field];
			const next = { ...current };
			if (Object.keys(draft).length) {
				next[entry.key] = draft;
			} else {
				delete next[entry.key];
			}
			return next;
		});
	}, []);

	const clearEntry = useCallback((key: string) => {
		setDrafts((current) => {
			const next = { ...current };
			delete next[key];
			return next;
		});
	}, []);

	const clearAll = useCallback(() => setDrafts({}), []);

	return {
		drafts,
		restoredCount,
		setFields,
		revertField,
		clearEntry,
		clearAll,
	};
}
