import { act, renderHook } from "@testing-library/react";
import { useBulkAlt } from "@/app/(dashboard)/admin/media/use-bulk-alt";

const generateMock = jest.fn();
const updateMock = jest.fn();
jest.mock("../src/actions/media.action", () => ({
	generateMediaAltAction: (...args: unknown[]) => generateMock(...args),
	updateMediaAltAction: (...args: unknown[]) => updateMock(...args),
}));

const item = (id: string) => ({
	id,
	path: `https://cdn.example.com/${id}.jpg`,
	relativePath: `${id}.jpg`,
	alt: null,
	originalName: `${id}.jpg`,
	mimeType: "image/jpeg",
	size: 1,
	width: 10,
	height: 10,
	createdAt: "2026-10-18T00:00:00.000Z",
});

describe("useBulkAlt", () => {
	beforeEach(() => jest.clearAllMocks());

	it("generates drafts one by one and saves only the reviewed ones", async () => {
		generateMock
			.mockResolvedValueOnce({ success: true, data: { alt: "Кіт" } })
			.mockResolvedValueOnce({ success: false, message: "Збій" })
			.mockResolvedValueOnce({ success: true, data: { alt: "Пес" } });
		updateMock.mockImplementation(async (id: string, alt: string) => ({
			success: true,
			data: { ...item(id), alt },
		}));
		const onSaved = jest.fn();
		const { result } = renderHook(() => useBulkAlt(onSaved));

		await act(() => result.current.start([item("a"), item("b"), item("c")]));

		expect(generateMock).toHaveBeenCalledTimes(3);
		expect(updateMock).not.toHaveBeenCalled();
		expect(result.current.summary).toMatchObject({ succeeded: 2, failed: 1 });
		expect(result.current.drafts.map((draft) => draft.error)).toEqual([
			undefined,
			"Збій",
			undefined,
		]);

		act(() => {
			result.current.setAlt("a", "Рудий кіт");
			result.current.setInclude("c", false);
		});
		await act(async () => {
			await expect(result.current.save()).resolves.toEqual({
				saved: 1,
				failed: 0,
			});
		});

		expect(updateMock).toHaveBeenCalledTimes(1);
		expect(updateMock).toHaveBeenCalledWith("a", "Рудий кіт");
		expect(onSaved).toHaveBeenCalledWith(
			expect.objectContaining({ id: "a", alt: "Рудий кіт" }),
		);
		expect(result.current.drafts.map((draft) => draft.item.id)).toEqual([
			"b",
			"c",
		]);
	});

	it("stops the whole run when the AI key is missing", async () => {
		generateMock.mockResolvedValue({
			success: false,
			message: "ШІ не налаштовано",
			status: 503,
			errorCode: "AI_NOT_CONFIGURED",
		});
		const { result } = renderHook(() => useBulkAlt(jest.fn()));

		await act(() => result.current.start([item("a"), item("b")]));

		expect(generateMock).toHaveBeenCalledTimes(1);
		expect(result.current.summary?.abortedWith).toBe("ШІ не налаштовано");
	});
});
