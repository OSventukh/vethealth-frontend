/**
 * @jest-environment node
 */
import type { GenerateEntrySeoResult } from "@/app/(dashboard)/admin/seo/actions/seo.action";
import {
	type BulkTask,
	runBulkGeneration,
} from "@/app/(dashboard)/admin/seo/run-bulk-generation";
import {
	buildSeoEntries,
	dirtyFields,
	fieldsToGenerate,
	lengthState,
	SEO_FIELDS,
	type SeoEntryResponse,
	type SeoValues,
} from "@/app/(dashboard)/admin/seo/seo-fields";
import { sanitizeDrafts } from "@/app/(dashboard)/admin/seo/use-seo-drafts";

const EMPTY: SeoValues = {
	metaTitle: null,
	metaDescription: null,
	metaKeywords: null,
	ogTitle: null,
	ogDescription: null,
};

const response = (
	overrides: Partial<SeoEntryResponse> &
		Pick<SeoEntryResponse, "type" | "slug">,
): SeoEntryResponse => ({
	id: overrides.slug,
	title: overrides.slug,
	status: "Published",
	metadata: EMPTY,
	...overrides,
});

describe("buildSeoEntries", () => {
	const entries = buildSeoEntries([
		response({ type: "topic", slug: "drugs", parentSlug: null }),
		response({ type: "topic", slug: "antiparasitic", parentSlug: "drugs" }),
		response({ type: "post", slug: "amidines", topicSlugs: ["antiparasitic"] }),
		response({
			type: "post",
			slug: "antiparasitic",
			topicSlugs: ["antiparasitic"],
		}),
		response({ type: "post", slug: "orphan", topicSlugs: [] }),
		response({ type: "page", slug: "privacy-policy" }),
		response({ type: "page", slug: "draft-page" }),
	]);
	const path = (key: string) =>
		entries.find((entry) => entry.key === key)?.path;

	it("builds public URLs like the sitemap does", () => {
		expect(path("topic:antiparasitic")).toBe("/drugs/antiparasitic");
		expect(path("post:amidines")).toBe("/drugs/antiparasitic/amidines");
		// hub-пост зі слагом теми не дублює слаг
		expect(path("post:antiparasitic")).toBe("/drugs/antiparasitic");
		expect(path("post:orphan")).toBeNull();
		expect(path("page:privacy-policy")).toBe("/privacy-policy");
		expect(path("page:draft-page")).toBeNull();
	});

	it("links each entry to its editor", () => {
		expect(entries[2].editHref).toBe("/admin/posts/edit/amidines");
		expect(entries[0].editHref).toBe("/admin/topics/edit/drugs");
	});
});

describe("field helpers", () => {
	const [entry] = buildSeoEntries([
		response({
			type: "post",
			slug: "a",
			metadata: { ...EMPTY, metaTitle: "Збережений" },
		}),
	]);

	it("generates only empty fields unless overwriting", () => {
		const values = {
			...Object.fromEntries(SEO_FIELDS.map((f) => [f, ""])),
			metaTitle: "є",
		} as Record<(typeof SEO_FIELDS)[number], string>;

		expect(fieldsToGenerate(values, false)).not.toContain("metaTitle");
		expect(fieldsToGenerate(values, false)).toHaveLength(4);
		expect(fieldsToGenerate(values, true)).toEqual([...SEO_FIELDS]);
	});

	it("treats a draft equal to the saved value as clean", () => {
		expect(dirtyFields(entry, { metaTitle: "Збережений" })).toEqual([]);
		expect(dirtyFields(entry, { metaTitle: "Новий", ogTitle: "" })).toEqual([
			"metaTitle",
		]);
	});

	it("rates lengths against the recommended range", () => {
		expect(lengthState("metaTitle", "  ")).toBe("empty");
		expect(lengthState("metaTitle", "а".repeat(20))).toBe("short");
		expect(lengthState("metaTitle", "а".repeat(50))).toBe("ok");
		expect(lengthState("metaTitle", "а".repeat(70))).toBe("long");
		expect(lengthState("metaKeywords", "будь-що")).toBe("ok");
	});

	it("restores only known entries and fields from storage", () => {
		expect(
			sanitizeDrafts(
				{
					"post:a": { metaTitle: "Новий", ogImage: "x", ogTitle: 42 },
					"post:a-same": { metaTitle: "Збережений" },
					"post:gone": { metaTitle: "Видалений пост" },
				},
				[entry],
			),
		).toEqual({ "post:a": { metaTitle: "Новий" } });
		expect(sanitizeDrafts("garbage", [entry])).toEqual({});
	});
});

describe("runBulkGeneration", () => {
	const task = (key: string): BulkTask => ({
		key,
		title: key,
		input: { type: "post", id: key },
	});
	const ok: GenerateEntrySeoResult = {
		success: true,
		data: { metaTitle: "т" },
	};

	const setup = (results: GenerateEntrySeoResult[]) => {
		const generate = jest.fn();
		for (const result of results) {
			generate.mockResolvedValueOnce(result);
		}
		return {
			generate,
			onSuccess: jest.fn(),
			onError: jest.fn(),
			onProgress: jest.fn(),
			isCancelled: jest.fn(() => false),
			sleep: jest.fn(async () => {}),
		};
	};

	it("processes tasks in order and keeps going after a failure", async () => {
		const deps = setup([
			ok,
			{ success: false, status: 502, message: "впало" },
			ok,
		]);

		const summary = await runBulkGeneration(
			[task("a"), task("b"), task("c")],
			deps,
		);

		expect(summary).toEqual({ succeeded: 2, failed: 1, cancelled: false });
		expect(deps.onError).toHaveBeenCalledWith(task("b"), "впало");
		expect(deps.onSuccess).toHaveBeenCalledTimes(2);
		expect(deps.onProgress).toHaveBeenLastCalledWith({ done: 3, total: 3 });
	});

	it("waits out a 429 and retries the same task", async () => {
		const deps = setup([
			{ success: false, status: 429, retryAfterSeconds: 3 },
			ok,
		]);

		const summary = await runBulkGeneration([task("a")], deps);

		expect(summary.succeeded).toBe(1);
		expect(deps.generate).toHaveBeenCalledTimes(2);
		expect(deps.sleep).toHaveBeenCalledTimes(3);
		expect(deps.onProgress).toHaveBeenCalledWith(
			expect.objectContaining({ waitingSeconds: 3 }),
		);
	});

	it("gives up on a task after repeated 429s", async () => {
		const limited = {
			success: false,
			status: 429,
			retryAfterSeconds: 1,
			message: "ліміт",
		};
		const deps = setup([limited, limited, limited, limited, ok]);

		const summary = await runBulkGeneration([task("a"), task("b")], deps);

		expect(summary).toEqual({ succeeded: 1, failed: 1, cancelled: false });
		expect(deps.generate).toHaveBeenCalledTimes(5);
	});

	it.each([
		{ success: false, status: 401, message: "сесія" },
		{
			success: false,
			status: 503,
			errorCode: "AI_NOT_CONFIGURED",
			message: "ключ",
		},
	])("aborts the whole run on %p", async (fatal) => {
		const deps = setup([fatal, ok]);

		const summary = await runBulkGeneration([task("a"), task("b")], deps);

		expect(summary.abortedWith).toBe(fatal.message);
		expect(deps.generate).toHaveBeenCalledTimes(1);
	});

	it("stops when cancelled", async () => {
		const deps = setup([ok, ok]);
		deps.isCancelled.mockReturnValueOnce(false).mockReturnValue(true);

		const summary = await runBulkGeneration([task("a"), task("b")], deps);

		expect(summary).toEqual({ succeeded: 1, failed: 0, cancelled: true });
	});
});
