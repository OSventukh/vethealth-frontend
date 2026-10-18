import { act, renderHook } from "@testing-library/react";
import { useMediaList } from "@/components/media-library/use-media-list";

const listMock = jest.fn();
jest.mock("../src/actions/media.action", () => ({
	listMediaAction: (...args: unknown[]) => listMock(...args),
}));

const item = (id: string) => ({
	id,
	path: `https://cdn.example.com/${id}.jpg`,
	relativePath: `${id}.jpg`,
	alt: null,
	originalName: null,
	mimeType: null,
	size: null,
	width: null,
	height: null,
	createdAt: "2026-10-18T00:00:00.000Z",
});

describe("useMediaList", () => {
	beforeEach(() => jest.clearAllMocks());

	it("loads more by offset after local uploads, without duplicates", async () => {
		const { result } = renderHook(() =>
			useMediaList({
				items: [item("a"), item("b")],
				count: 4,
				currentPage: 1,
				totalPages: 2,
			}),
		);
		// Нове завантаження: на сервері воно тепер перше, і «сторінка 2» зсунулась.
		act(() => result.current.prepend(item("new")));
		expect(result.current.hasMore).toBe(true);
		listMock.mockResolvedValue({
			success: true,
			// Сервер з offset=3 віддає c, d; b — гонка, повтор має відсіятись.
			data: { items: [item("b"), item("c"), item("d")], count: 5 },
		});

		await act(() => result.current.loadMore());

		expect(listMock).toHaveBeenCalledWith(
			expect.objectContaining({ offset: 3 }),
		);
		expect(result.current.items.map(({ id }) => id)).toEqual([
			"new",
			"a",
			"b",
			"c",
			"d",
		]);
		expect(result.current.hasMore).toBe(false);
	});
});
