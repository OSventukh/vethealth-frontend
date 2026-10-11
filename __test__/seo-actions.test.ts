/**
 * @jest-environment node
 */
import { updateTag } from "next/cache";
import {
	generateEntrySeoAction,
	saveEntrySeoAction,
} from "@/app/(dashboard)/admin/seo/actions/seo.action";
import { SESSION_EXPIRED_MESSAGE } from "@/app/(dashboard)/admin/actions/seo-error-message";
import { auth } from "@/lib/session/auth";

jest.mock("next/cache", () => ({ updateTag: jest.fn() }));
jest.mock("../src/lib/session/auth", () => ({ auth: jest.fn() }));
jest.mock("../src/logger", () => ({
	__esModule: true,
	default: { error: jest.fn() },
}));

const authMock = auth as jest.Mock;
const ref = { type: "topic" as const, id: "t1" };

describe("seo actions", () => {
	const fetchMock = jest.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		(updateTag as jest.Mock).mockReset();
		global.fetch = fetchMock;
		authMock.mockResolvedValue({ token: "t" });
	});

	it("does not call the backend without a session", async () => {
		authMock.mockResolvedValue(null);

		await expect(generateEntrySeoAction(ref)).resolves.toMatchObject({
			success: false,
			status: 401,
			message: SESSION_EXPIRED_MESSAGE,
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("posts the options to the entry's generate endpoint", async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ metaTitle: "Новий" }), { status: 200 }),
		);

		const result = await generateEntrySeoAction({
			...ref,
			fields: ["metaTitle"],
			hint: "коротше",
		});

		expect(result).toEqual({ success: true, data: { metaTitle: "Новий" } });
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toMatch(/\/seo\/topic\/t1\/generate$/);
		expect(JSON.parse(init.body)).toEqual({
			fields: ["metaTitle"],
			hint: "коротше",
		});
		expect(init.headers.Authorization).toBe("Bearer t");
	});

	it("passes status, code and Retry-After through for the bulk runner", async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({ statusCode: 429, errorCode: "AI_RATE_LIMITED" }),
				{ status: 429, headers: { "Retry-After": "12" } },
			),
		);

		await expect(generateEntrySeoAction(ref)).resolves.toMatchObject({
			success: false,
			status: 429,
			errorCode: "AI_RATE_LIMITED",
			retryAfterSeconds: 12,
			message: expect.stringMatching(/через 12 с/),
		});
	});

	it("explains an entry without text", async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({ statusCode: 400, errorCode: "SEO_NO_CONTENT" }),
				{ status: 400 },
			),
		);

		const result = await generateEntrySeoAction(ref);

		expect(result.message).toMatch(/немає тексту/);
	});

	it("saves changed fields and revalidates the entry's pages", async () => {
		const saved = { metaTitle: "Новий" };
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify(saved), { status: 200 }),
		);

		const result = await saveEntrySeoAction({
			...ref,
			values: { metaTitle: "Новий" },
		});

		expect(result).toEqual({ success: true, data: saved });
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toMatch(/\/seo\/topic\/t1$/);
		expect(init.method).toBe("PATCH");
		expect(updateTag).toHaveBeenCalledWith("topics");
	});

	it("does not revalidate when saving fails", async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ statusCode: 400 }), { status: 400 }),
		);

		const result = await saveEntrySeoAction({
			...ref,
			values: { metaTitle: "x" },
		});

		expect(result.success).toBe(false);
		expect(updateTag).not.toHaveBeenCalled();
	});
});
