/**
 * Історія змін поста: порівняння версії з формою (`diffRevision`) і панель
 * «Історія змін» — список, перегляд версії, відновлення з підтвердженням.
 */
import {
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import type {
	PostRevision,
	PostRevisionSummary,
} from "@/api/types/post-revisions.type";
import {
	diffRevision,
	editorName,
	type RevisionComparable,
} from "@/app/(dashboard)/admin/posts/components/EditPost/revisions/revision-diff";
import { RevisionHistoryButton } from "@/app/(dashboard)/admin/posts/components/EditPost/revisions/revision-history-sheet";
import {
	getPostRevisionAction,
	listPostRevisionsAction,
	restorePostRevisionAction,
} from "@/app/(dashboard)/admin/posts/actions/post-revisions.action";

jest.mock(
	"../src/app/(dashboard)/admin/posts/actions/post-revisions.action",
	() => ({
		listPostRevisionsAction: jest.fn(),
		getPostRevisionAction: jest.fn(),
		restorePostRevisionAction: jest.fn(),
	}),
);
const toastMock = jest.fn();
jest.mock("../src/components/ui/use-toast", () => ({
	useToast: () => ({ toast: toastMock }),
}));

const lexical = (text: string) =>
	JSON.stringify({
		root: {
			type: "root",
			children: [
				{ type: "paragraph", children: [{ type: "text", text }] },
			],
		},
	});

const current: RevisionComparable = {
	title: "Поточний заголовок",
	slug: "potochnyi",
	content: lexical("один два три"),
	featuredImageFileId: "file-1",
	featuredImageUrl: null,
	metaTitle: "Мета",
	metaDescription: "Опис",
};

const summary = (
	overrides: Partial<PostRevisionSummary>,
): PostRevisionSummary => ({
	id: "rev",
	postId: "post-1",
	title: "Поточний заголовок",
	slug: "potochnyi",
	status: "Published",
	reason: "update",
	restoredFromId: null,
	editorId: "user-1",
	editor: { id: "user-1", firstname: "Олена", lastname: "Коваль" },
	createdAt: "2026-10-30T10:00:00.000Z",
	...overrides,
});

const revision = (overrides: Partial<PostRevision>): PostRevision => ({
	...summary({}),
	content: current.content,
	metadata: { metaTitle: "Мета", metaDescription: "Опис" },
	featuredImageFileId: "file-1",
	featuredImageUrl: null,
	...overrides,
});

describe("diffRevision", () => {
	it("reports nothing for a revision identical to the form", () => {
		expect(diffRevision(revision({}), current)).toEqual([]);
	});

	it("lists changed title, slug, image and SEO fields", () => {
		const fields = diffRevision(
			revision({
				title: "Старий",
				slug: "staryi",
				featuredImageFileId: null,
				metadata: { metaTitle: "Інша мета" },
			}),
			current,
		).map((change) => change.field);
		expect(fields).toEqual(["title", "slug", "image", "seo"]);
	});

	it("compares content by text and reports the word delta", () => {
		const [change] = diffRevision(
			revision({ content: lexical("один два три чотири п'ять") }),
			current,
		);
		expect(change).toMatchObject({
			field: "content",
			label: "Текст статті",
			detail: "+2 слів відносно поточного",
		});
	});

	it("treats a JSON-only difference as formatting, not text", () => {
		const sameTextOtherJson = JSON.stringify({
			root: {
				type: "root",
				children: [
					{
						type: "paragraph",
						format: "center",
						children: [{ type: "text", text: "один два три" }],
					},
				],
			},
		});
		const [change] = diffRevision(
			revision({ content: sameTextOtherJson }),
			current,
		);
		expect(change.label).toBe("Оформлення статті");
	});

	it("ignores SEO when the revision has no metadata snapshot", () => {
		expect(
			diffRevision(revision({ metadata: null }), {
				...current,
				metaTitle: "Будь-що",
			}),
		).toEqual([]);
	});

	it("names the editor, the baseline and deleted users", () => {
		expect(editorName(summary({}))).toBe("Олена Коваль");
		expect(editorName(summary({ reason: "baseline", editor: null }))).toBe(
			"—",
		);
		expect(editorName(summary({ editor: null }))).toBe("Видалений користувач");
	});
});

describe("RevisionHistoryButton", () => {
	const latest = summary({ id: "rev-2", createdAt: "2026-10-31T09:00:00Z" });
	const older = summary({
		id: "rev-1",
		title: "Старий заголовок",
		reason: "baseline",
		editor: null,
		editorId: null,
		createdAt: "2026-10-01T09:00:00Z",
	});

	const renderButton = (
		props: Partial<Parameters<typeof RevisionHistoryButton>[0]> = {},
	) => {
		const onRestored = jest.fn();
		render(
			<RevisionHistoryButton
				postId="post-1"
				getCurrent={() => current}
				isDirty={false}
				onRestored={onRestored}
				{...props}
			/>,
		);
		return { onRestored };
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(listPostRevisionsAction as jest.Mock).mockResolvedValue({
			success: true,
			data: [latest, older],
		});
		(getPostRevisionAction as jest.Mock).mockResolvedValue({
			success: true,
			data: revision({ ...older, title: "Старий заголовок" }),
		});
	});

	it("loads the list on open and marks the newest version as current", async () => {
		renderButton();
		fireEvent.click(screen.getByRole("button", { name: /Історія змін/ }));

		expect(await screen.findByText("Старий заголовок")).toBeInTheDocument();
		expect(listPostRevisionsAction).toHaveBeenCalledWith("post-1");
		expect(screen.getByText("Поточна")).toBeInTheDocument();
		expect(screen.getByText(/Стан до появи історії/)).toBeInTheDocument();
	});

	it("shows an empty state for posts without history", async () => {
		(listPostRevisionsAction as jest.Mock).mockResolvedValue({
			success: true,
			data: [],
		});
		renderButton();
		fireEvent.click(screen.getByRole("button", { name: /Історія змін/ }));
		expect(
			await screen.findByText(/зʼявиться після першого збереження/),
		).toBeInTheDocument();
	});

	it("shows the load error", async () => {
		(listPostRevisionsAction as jest.Mock).mockResolvedValue({
			success: false,
			message: "Недостатньо прав для історії цієї статті",
		});
		renderButton();
		fireEvent.click(screen.getByRole("button", { name: /Історія змін/ }));
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Недостатньо прав",
		);
	});

	it("previews an older version with its differences and restores it after confirmation", async () => {
		const restoredPost = { id: "post-1", slug: "potochnyi", title: "Старий заголовок" };
		(restorePostRevisionAction as jest.Mock).mockResolvedValue({
			success: true,
			data: restoredPost,
		});
		const { onRestored } = renderButton({ isDirty: true });
		fireEvent.click(screen.getByRole("button", { name: /Історія змін/ }));
		fireEvent.click(await screen.findByText("Старий заголовок"));

		expect(
			await screen.findByText(/Відрізняється від того, що зараз у редакторі/),
		).toBeInTheDocument();
		const differences = screen.getByRole("region", {
			name: "Відмінності від редактора",
		});
		expect(within(differences).getByText("Заголовок")).toBeInTheDocument();
		expect(getPostRevisionAction).toHaveBeenCalledWith("post-1", "rev-1");

		fireEvent.click(screen.getByRole("button", { name: /Відновити цю версію/ }));
		expect(
			await screen.findByText(/незбережені зміни — їх буде втрачено/),
		).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: /^Відновити$/ }));

		await waitFor(() => expect(onRestored).toHaveBeenCalledWith(restoredPost));
		expect(restorePostRevisionAction).toHaveBeenCalledWith("post-1", "rev-1");
		expect(toastMock).toHaveBeenCalledWith(
			expect.objectContaining({ variant: "success" }),
		);
	});

	it("does not offer restoring the current version", async () => {
		(getPostRevisionAction as jest.Mock).mockResolvedValue({
			success: true,
			data: revision({ ...latest }),
		});
		renderButton();
		fireEvent.click(screen.getByRole("button", { name: /Історія змін/ }));
		fireEvent.click(await screen.findByText("Поточна"));
		expect(
			await screen.findByText(/збігається з тим, що зараз у редакторі/),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /Відновити цю версію/ }),
		).not.toBeInTheDocument();
	});

	it("shows the conflict message and keeps the editor intact when restore fails", async () => {
		(restorePostRevisionAction as jest.Mock).mockResolvedValue({
			success: false,
			message: "Заголовок або адресу цієї версії вже використовує стаття «Інша»",
		});
		const { onRestored } = renderButton();
		fireEvent.click(screen.getByRole("button", { name: /Історія змін/ }));
		fireEvent.click(await screen.findByText("Старий заголовок"));
		fireEvent.click(
			await screen.findByRole("button", { name: /Відновити цю версію/ }),
		);
		fireEvent.click(await screen.findByRole("button", { name: /^Відновити$/ }));

		await waitFor(() =>
			expect(toastMock).toHaveBeenCalledWith(
				expect.objectContaining({ variant: "destructive" }),
			),
		);
		expect(onRestored).not.toHaveBeenCalled();
	});
});
