/**
 * Smoke test for the redesigned post editor: the tabbed layout must mount
 * with the content tab (title card + Lexical), keep the SEO/settings panels
 * in the DOM (keepMounted — Lexical must not lose state on tab switches),
 * and always render the publish rail.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EditPost from "@/app/(dashboard)/admin/posts/components/EditPost";
import type { PostResponse } from "@/api/types/posts.type";
import { UserRoleEnum, UserStatusEnum } from "@/utils/enums/user.enum";
import "@testing-library/jest-dom";

jest.mock("../src/actions/image-upload.action", () => ({
	imageUploadAction: jest.fn(),
}));
jest.mock(
	"../src/app/(dashboard)/admin/posts/actions/save-post.action",
	() => ({
		savePostAction: jest.fn().mockResolvedValue({
			success: true,
			error: false,
			message: "Success",
		}),
	}),
);
jest.mock(
	"../src/app/(dashboard)/admin/posts/actions/delete-post.action",
	() => ({
		deletePostAction: jest.fn(),
	}),
);
jest.mock("../src/app/(dashboard)/admin/actions/generate-seo.action", () => ({
	generateSeoAction: jest.fn().mockResolvedValue({ success: true }),
}));
jest.mock("next/navigation", () => ({
	useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

const post: PostResponse = {
	id: "post-1",
	title: "Сечокамʼяна хвороба у котів",
	content: "",
	slug: "sechokamyana-khvoroba-u-kotiv",
	featuredImage: null,
	createdAt: "2026-01-01",
	status: "Draft",
	topics: [],
	categories: [],
	metadata: {
		id: "meta-1",
		metaTitle: "Мета заголовок",
		indexable: true,
		followable: true,
	},
};

const admin = {
	id: "user-1",
	firstname: "Олена",
	lastname: "Коваль",
	role: { id: "2", name: UserRoleEnum.Administrator },
	status: { id: "1", name: UserStatusEnum.Active },
};

describe("EditPost (tabbed redesign)", () => {
	it("mounts the content tab with title, slug and the Lexical editor", async () => {
		render(<EditPost initialData={post} editMode user={admin} />);

		expect(
			screen.getByDisplayValue("Сечокамʼяна хвороба у котів"),
		).toBeInTheDocument();
		// Спільне slug-поле рендериться тричі: Контент, SEO (мета-картка),
		// Налаштування — усі панелі тримаються в DOM через keepMounted.
		expect(
			screen.getAllByDisplayValue("sechokamyana-khvoroba-u-kotiv"),
		).toHaveLength(3);
		expect(screen.getByText("Редагування статті")).toBeInTheDocument();

		// Lexical is dynamically imported — wait for the editor to appear.
		await waitFor(() => {
			expect(
				document.querySelector('[contenteditable="true"]'),
			).not.toBeNull();
		});
	});

	it("keeps all tab panels mounted (Lexical state survives tab switches)", async () => {
		render(<EditPost initialData={post} editMode user={admin} />);

		await waitFor(() => {
			expect(document.querySelector('[contenteditable="true"]')).not.toBeNull();
		});

		fireEvent.click(screen.getByRole("tab", { name: /SEO та метадані/ }));

		// SEO panel is visible…
		await waitFor(() => {
			expect(screen.getByText("Мета-теги")).toBeInTheDocument();
		});
		// …and the editor is still in the DOM (keepMounted).
		expect(document.querySelector('[contenteditable="true"]')).not.toBeNull();

		fireEvent.click(screen.getByRole("tab", { name: /Налаштування/ }));
		await waitFor(() => {
			expect(screen.getByText("Небезпечна зона")).toBeInTheDocument();
		});
		expect(document.querySelector('[contenteditable="true"]')).not.toBeNull();
	});

	it("renders the publish rail with role-gated actions and status pill", () => {
		render(<EditPost initialData={post} editMode user={admin} />);

		expect(screen.getByText("Опублікувати")).toBeInTheDocument();
		expect(screen.getByText("Зберегти чернетку")).toBeInTheDocument();
		expect(screen.getByText("Чернетка")).toBeInTheDocument();
		expect(screen.getByText("Олена Коваль")).toBeInTheDocument();
		expect(screen.getByText("Класифікація")).toBeInTheDocument();
		expect(screen.getByText("Обкладинка")).toBeInTheDocument();
	});

	it("shows «На перегляд» instead of «Опублікувати» for non-admin roles", () => {
		render(
			<EditPost
				initialData={post}
				editMode
				user={{
					...admin,
					role: { id: "4", name: UserRoleEnum.Writer },
				}}
			/>,
		);

		expect(screen.getByText("На перегляд")).toBeInTheDocument();
		expect(screen.queryByText("Опублікувати")).not.toBeInTheDocument();
	});
});
