"use client";
import { useEffect, useRef, useState } from "react";
import {
	generateMediaAltAction,
	updateMediaAltAction,
} from "@/actions/media.action";
import type { MediaItem } from "@/api/types/media.type";
import {
	type BulkProgress,
	type BulkSummary,
	runBulkGeneration,
} from "../seo/run-bulk-generation";

export interface AltDraft {
	item: MediaItem;
	/** undefined — ще не згенеровано. */
	alt?: string;
	error?: string;
	/** Зберігати цей рядок (знімається, щоб пропустити невдалий варіант). */
	include: boolean;
}

/**
 * Масова генерація alt: по черзі через той самий раннер, що й масове SEO
 * (чекає на 429, зупиняється на 401/відсутньому ключі). Нічого не
 * зберігається, доки редактор не перегляне чернетки й не натисне «Зберегти».
 */
export function useBulkAlt(onSaved: (item: MediaItem) => void) {
	const [drafts, setDrafts] = useState<AltDraft[]>([]);
	const [running, setRunning] = useState(false);
	const [saving, setSaving] = useState(false);
	const [progress, setProgress] = useState<BulkProgress | null>(null);
	const [summary, setSummary] = useState<BulkSummary | null>(null);
	const cancelled = useRef(false);

	const patch = (id: string, change: Partial<AltDraft>) =>
		setDrafts((previous) =>
			previous.map((draft) =>
				draft.item.id === id ? { ...draft, ...change } : draft,
			),
		);

	const unsaved = drafts.filter((draft) => draft.alt).length;

	// Генерація оплачена — не даємо випадково закрити вкладку з непереглянутим.
	useEffect(() => {
		if (!unsaved && !running) return;
		const warn = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [unsaved, running]);

	const start = async (items: MediaItem[]) => {
		cancelled.current = false;
		setSummary(null);
		setDrafts(items.map((item) => ({ item, include: true })));
		setRunning(true);
		const result = await runBulkGeneration<{ id: string }, { alt: string }>(
			items.map((item) => ({
				key: item.id,
				title: item.originalName || item.id,
				input: { id: item.id },
			})),
			{
				generate: ({ id }) => generateMediaAltAction(id),
				onSuccess: (task, data) =>
					patch(task.key, { alt: data.alt, error: undefined }),
				onError: (task, message) =>
					patch(task.key, { error: message, include: false }),
				onProgress: setProgress,
				isCancelled: () => cancelled.current,
			},
		);
		setRunning(false);
		setProgress(null);
		setSummary(result);
	};

	const save = async (): Promise<{ saved: number; failed: number }> => {
		const toSave = drafts.filter((draft) => draft.include && draft.alt?.trim());
		let saved = 0;
		let failed = 0;
		setSaving(true);
		for (const draft of toSave) {
			// Послідовно: це звичайні PATCH, паралель не дала б нічого, крім піку.
			// oxlint-disable-next-line no-await-in-loop
			const result = await updateMediaAltAction(
				draft.item.id,
				draft.alt!.trim(),
			);
			if (result.success) {
				saved++;
				onSaved(result.data);
				setDrafts((previous) =>
					previous.filter((existing) => existing.item.id !== draft.item.id),
				);
			} else {
				failed++;
				patch(draft.item.id, { error: result.message });
			}
		}
		setSaving(false);
		return { saved, failed };
	};

	return {
		drafts,
		running,
		saving,
		progress,
		summary,
		unsaved,
		start,
		save,
		stop: () => {
			cancelled.current = true;
		},
		setAlt: (id: string, alt: string) => patch(id, { alt, include: true }),
		setInclude: (id: string, include: boolean) => patch(id, { include }),
		clear: () => {
			setDrafts([]);
			setSummary(null);
		},
	};
}

export type BulkAlt = ReturnType<typeof useBulkAlt>;
