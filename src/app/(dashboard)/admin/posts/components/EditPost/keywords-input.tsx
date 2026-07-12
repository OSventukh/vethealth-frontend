import { XIcon } from "lucide-react";
import { useState } from "react";

type Props = {
	value: string;
	onChange: (value: string) => void;
};

const parseKeywords = (value: string): string[] =>
	value
		.split(",")
		.map((keyword) => keyword.trim())
		.filter(Boolean);

export function KeywordsInput({ value, onChange }: Props) {
	const [draft, setDraft] = useState("");
	const keywords = parseKeywords(value);

	const add = () => {
		const keyword = draft.trim().replace(/,+$/, "");
		if (!keyword || keywords.includes(keyword)) {
			setDraft("");
			return;
		}
		onChange([...keywords, keyword].join(", "));
		setDraft("");
	};

	const remove = (keyword: string) => {
		onChange(keywords.filter((item) => item !== keyword).join(", "));
	};

	return (
		<div className="border-input bg-background flex min-h-11 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5">
			{keywords.map((keyword) => (
				<span
					key={keyword}
					className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
				>
					{keyword}
					<button
						type="button"
						aria-label={`Видалити ${keyword}`}
						onClick={() => remove(keyword)}
						className="opacity-70 hover:opacity-100"
					>
						<XIcon size={12} />
					</button>
				</span>
			))}
			<input
				type="text"
				value={draft}
				onChange={(event) => setDraft(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === "Enter" || event.key === ",") {
						event.preventDefault();
						add();
					}
				}}
				onBlur={add}
				placeholder={
					keywords.length ? "" : "Додайте 3–7 ключових слів та натисніть Enter…"
				}
				className="min-w-[140px] flex-1 border-0 bg-transparent px-1 py-0.5 text-sm outline-none"
			/>
		</div>
	);
}
