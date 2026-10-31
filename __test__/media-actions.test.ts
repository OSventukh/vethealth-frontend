/**
 * @jest-environment node
 */
import { SESSION_EXPIRED_MESSAGE } from "@/app/(dashboard)/admin/actions/seo-error-message";
import {
	bulkDeleteMediaAction,
	deleteMediaAction,
	generateMediaAltAction,
	listMediaAction,
} from "@/actions/media.action";
import { auth } from "@/lib/session/auth";

jest.mock("../src/lib/session/auth", () => ({ auth: jest.fn() }));
jest.mock("../src/logger", () => ({
	__esModule: true,
	default: { error: jest.fn() },
}));

const authMock = auth as jest.Mock;
const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json" },
	});

describe("media actions", () => {
	const fetchMock = jest.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		global.fetch = fetchMock;
		authMock.mockResolvedValue({ token: "t" });
	});

	it("does not call the backend without a session", async () => {
		authMock.mockResolvedValue(null);

		await expect(listMediaAction()).resolves.toEqual({
			success: false,
			message: SESSION_EXPIRED_MESSAGE,
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("passes search and the missing-alt filter as query params", async () => {
		fetchMock.mockResolvedValue(
			json({ items: [], count: 0, currentPage: 1, totalPages: 0 }),
		);

		await listMediaAction({
			page: 2,
			size: 40,
			search: " кіт ",
			missingAlt: true,
		});

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toMatch(
			/\/media\?page=2&size=40&search=%D0%BA%D1%96%D1%82&missingAlt=true$/,
		);
		expect(init.headers.Authorization).toBe("Bearer t");
	});

	it("returns the usages when the backend refuses to delete a used file", async () => {
		const usages = [
			{
				type: "post",
				id: "p1",
				title: "Кліщі",
				slug: "ticks",
				fields: ["cover"],
			},
		];
		fetchMock.mockResolvedValue(
			json({ statusCode: 409, errorCode: "MEDIA_IN_USE", usages }, 409),
		);

		await expect(deleteMediaAction("f1")).resolves.toEqual({
			success: false,
			message: "Файл використовується в матеріалах",
			usages,
		});
		expect(fetchMock.mock.calls[0][0]).toMatch(/\/media\/f1$/);
	});

	it("forces the delete only when asked", async () => {
		fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

		await expect(deleteMediaAction("f1", true)).resolves.toEqual({
			success: true,
		});
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toMatch(/\/media\/f1\?force=true$/);
		expect(init.method).toBe("DELETE");
	});

	it("maps media error codes of the alt generation to editor messages", async () => {
		fetchMock.mockResolvedValue(
			json({ statusCode: 400, errorCode: "MEDIA_UNSUPPORTED_FOR_AI" }, 400),
		);

		const result = await generateMediaAltAction("f1", { current: "старий" });

		expect(result).toMatchObject({
			success: false,
			status: 400,
			errorCode: "MEDIA_UNSUPPORTED_FOR_AI",
			message: expect.stringContaining("не вдалося розпізнати як зображення"),
		});
		expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
			current: "старий",
		});
	});

	it("adds the unused and width filters to the query", async () => {
		fetchMock.mockResolvedValue(
			json({ items: [], count: 0, currentPage: 1, totalPages: 0 }),
		);

		await listMediaAction({ unused: true, narrowerThan: 1200 });

		expect(fetchMock.mock.calls[0][0]).toMatch(
			/\/media\?unused=true&narrowerThan=1200$/,
		);
	});

	it("gives the bulk runner what it needs to wait on rate limits", async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ errorCode: "AI_RATE_LIMITED" }), {
				status: 429,
				headers: { "content-type": "application/json", "Retry-After": "7" },
			}),
		);

		await expect(generateMediaAltAction("f1")).resolves.toMatchObject({
			success: false,
			status: 429,
			errorCode: "AI_RATE_LIMITED",
			retryAfterSeconds: 7,
		});
	});

	it("reports 401 without a session so the bulk run stops", async () => {
		authMock.mockResolvedValue(null);

		await expect(generateMediaAltAction("f1")).resolves.toMatchObject({
			success: false,
			status: 401,
		});
	});

	it("posts ids for bulk delete and returns skipped files", async () => {
		const result = { deleted: ["a"], inUse: [{ id: "b", usages: [] }] };
		fetchMock.mockResolvedValue(json(result));

		await expect(bulkDeleteMediaAction(["a", "b"])).resolves.toEqual({
			success: true,
			data: result,
		});
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toMatch(/\/media\/bulk-delete$/);
		expect(JSON.parse(init.body)).toEqual({ ids: ["a", "b"], force: false });
	});

	it("falls back to an alt-specific message for unknown failures", async () => {
		fetchMock.mockResolvedValue(json({ statusCode: 400 }, 400));

		await expect(generateMediaAltAction("f1")).resolves.toMatchObject({
			success: false,
			message: "Не вдалося згенерувати alt-текст. Спробуйте ще раз",
		});
	});
});
