import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GenerateSeoButton } from "@/app/(dashboard)/admin/components/generate-seo-button";
import {
	generateSeoAction,
	type GenerateSeoInput,
} from "@/app/(dashboard)/admin/actions/generate-seo.action";

jest.mock("../src/app/(dashboard)/admin/actions/generate-seo.action", () => ({
	generateSeoAction: jest.fn(),
}));
const toast = jest.fn();
jest.mock("../src/components/ui/use-toast", () => ({
	useToast: () => ({ toast }),
}));
const generate = generateSeoAction as jest.Mock;
const input: GenerateSeoInput = {
	title: "Бабезіоз",
	text: "Текст статті",
	entityType: "post",
	fields: ["metaDescription"],
	current: { metaTitle: "Профілактика бабезіозу у собак" },
};

beforeEach(() => {
	generate.mockReset();
	toast.mockReset();
});

it("does not call the server when every requested field is already filled", () => {
	render(
		<GenerateSeoButton
			getInput={() => ({ ...input, fields: [] })}
			onGenerated={jest.fn()}
			values={{}}
		/>,
	);
	fireEvent.click(screen.getByRole("button", { name: "Заповнити з ШІ" }));
	expect(generate).not.toHaveBeenCalled();
	expect(toast).toHaveBeenCalledWith(
		expect.objectContaining({
			description: expect.stringContaining("Усі поля вже заповнені"),
		}),
	);
});

it("passes the current fields, search query and wish, and displays review warnings", async () => {
	generate.mockResolvedValue({
		success: true,
		data: { metaDescription: "Короткий опис" },
		warnings: ["metaDescription: рекомендовано 120–160 символів."],
	});
	const apply = jest.fn(() => 1);
	const generated = { metaDescription: "Короткий опис" };
	const { rerender } = render(
		<GenerateSeoButton
			getInput={() => input}
			onGenerated={apply}
			values={generated}
		/>,
	);
	fireEvent.change(screen.getByLabelText("Головний пошуковий запит"), {
		target: { value: " бабезіоз у собак " },
	});
	fireEvent.change(screen.getByLabelText("Побажання для ШІ"), {
		target: { value: "акцент на профілактиці" },
	});
	fireEvent.click(screen.getByRole("button", { name: "Заповнити з ШІ" }));
	await waitFor(() =>
		expect(apply).toHaveBeenCalledWith({ metaDescription: "Короткий опис" }),
	);
	expect(generate).toHaveBeenCalledWith({
		...input,
		primaryKeyword: "бабезіоз у собак",
		hint: "акцент на профілактиці",
	});
	expect(screen.getByRole("status")).toHaveTextContent("120–160");

	// Після ручної правки поля попередження про згенероване значення застаріле.
	rerender(
		<GenerateSeoButton
			getInput={() => input}
			onGenerated={apply}
			values={{ metaDescription: "Опис, виправлений редактором вручну" }}
		/>,
	);
	expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
