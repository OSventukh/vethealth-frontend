import type { PageBlockDataMap, PageBlockType } from "./types";

export interface BlockMeta {
	label: string;
	group: "Структура" | "Текст" | "Медіа";
	glyph: string;
}

export const BLOCK_META: Record<PageBlockType, BlockMeta> = {
	hero: { label: "Герой-секція", group: "Структура", glyph: "H" },
	heading: { label: "Заголовок", group: "Текст", glyph: "T" },
	richtext: { label: "Текстовий блок", group: "Текст", glyph: "¶" },
	stats: { label: "Показники", group: "Структура", glyph: "#" },
	services: { label: "Сітка послуг", group: "Структура", glyph: "▦" },
	team: { label: "Команда", group: "Структура", glyph: "☻" },
	gallery: { label: "Галерея", group: "Медіа", glyph: "▣" },
	image: { label: "Зображення", group: "Медіа", glyph: "▢" },
	cta: { label: "Заклик до дії", group: "Структура", glyph: "!" },
	faq: { label: "Питання-відповіді", group: "Структура", glyph: "?" },
	contacts: { label: "Контакти", group: "Структура", glyph: "@" },
};

const DEFAULT_DATA_FACTORIES: {
	[T in PageBlockType]: () => PageBlockDataMap[T];
} = {
	hero: () => ({
		eyebrow: "НАДЗАГОЛОВОК",
		title: "Заголовок герой-секції",
		text: "Короткий вступний текст про вашу клініку.",
		ctaLabel: "Записатися на прийом",
		ctaHref: "",
		imageUrl: "",
		imageAlt: "",
	}),
	heading: () => ({ text: "Новий заголовок" }),
	richtext: () => ({ content: "" }),
	stats: () => ({
		items: [
			{ value: "100+", label: "показник" },
			{ value: "24/7", label: "показник" },
			{ value: "12", label: "показник" },
		],
	}),
	services: () => ({
		title: "Наші послуги",
		cols: 3,
		items: [
			{ title: "Послуга 1", description: "" },
			{ title: "Послуга 2", description: "" },
			{ title: "Послуга 3", description: "" },
		],
	}),
	team: () => ({
		title: "Наша команда",
		members: [{ name: "Ім'я Прізвище", role: "Спеціалізація", photoUrl: "" }],
	}),
	gallery: () => ({ images: [] }),
	image: () => ({ url: "", alt: "", caption: "" }),
	cta: () => ({
		title: "Потрібна консультація?",
		text: "Зателефонуйте нам або залиште заявку.",
		btnLabel: "Залишити заявку",
		btnHref: "",
	}),
	faq: () => ({
		title: "Часті запитання",
		items: [{ question: "Нове запитання?", answer: "Відповідь." }],
	}),
	contacts: () => ({
		title: "Як нас знайти",
		address: "",
		phone: "",
		email: "",
		schedule: "",
	}),
};

export function createDefaultBlockData<T extends PageBlockType>(
	type: T,
): PageBlockDataMap[T] {
	return DEFAULT_DATA_FACTORIES[type]();
}
