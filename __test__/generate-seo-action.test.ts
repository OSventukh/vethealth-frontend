/**
 * @jest-environment node
 */
import { generateSeoAction } from "@/app/(dashboard)/admin/actions/generate-seo.action";
import { SESSION_EXPIRED_MESSAGE } from "@/app/(dashboard)/admin/actions/seo-error-message";
import { auth } from "@/lib/session/auth";

jest.mock("../src/lib/session/auth", () => ({ auth: jest.fn() }));
jest.mock("../src/logger", () => ({
	__esModule: true,
	default: { error: jest.fn() },
}));

const authMock = auth as jest.Mock;
const input = {
	title: "Титул",
	text: "Текст",
	entityType: "post" as const,
	fields: ["metaTitle" as const],
};

describe("generateSeoAction", () => {
	const fetchMock = jest.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		global.fetch = fetchMock;
	});

	it("asks to log in again without calling the backend when there is no token", async () => {
		authMock.mockResolvedValue(null);

		await expect(generateSeoAction(input)).resolves.toEqual({
			success: false,
			message: SESSION_EXPIRED_MESSAGE,
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("maps the backend errorCode and Retry-After into the message", async () => {
		authMock.mockResolvedValue({ token: "t" });
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({ statusCode: 429, errorCode: "AI_RATE_LIMITED" }),
				{ status: 429, headers: { "Retry-After": "7" } },
			),
		);

		const result = await generateSeoAction(input);

		expect(result.success).toBe(false);
		expect(result.message).toMatch(/через 7 с/);
		expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer t");
	});
	it("skips generation when nothing is missing", async () => {
		authMock.mockResolvedValue({ token: "t" });
		expect(await generateSeoAction({ ...input, fields: [] })).toEqual({
			success: true,
			data: {},
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("forwards context and returns advisory warnings separately from metadata", async () => {
		authMock.mockResolvedValue({ token: "t" });
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({ metaTitle: "Коти", warnings: ["Короткий заголовок"] }),
			),
		);
		const request = {
			...input,
			current: { ogTitle: "Догляд за котами" },
			primaryKeyword: "коти",
			sourceTruncated: true,
		};
		expect(await generateSeoAction(request)).toEqual({
			success: true,
			data: { metaTitle: "Коти" },
			warnings: ["Короткий заголовок"],
		});
		expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(request);
	});
});
