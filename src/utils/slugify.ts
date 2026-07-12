/**
 * UX-прев'ю слага: віддзеркалює npm `slugify` з locale "uk" (КМУ-2010),
 * яким backend генерує канонічний слаг. Backend переслагіфікує надіслане
 * значення, тому результат мусить бути ідемпотентним для чистого входу.
 */
const UK_CHAR_MAP: Record<string, string> = {
	а: "a",
	б: "b",
	в: "v",
	г: "h",
	ґ: "g",
	д: "d",
	е: "e",
	є: "ye",
	ж: "zh",
	з: "z",
	и: "y",
	і: "i",
	ї: "yi",
	й: "y",
	к: "k",
	л: "l",
	м: "m",
	н: "n",
	о: "o",
	п: "p",
	р: "r",
	с: "s",
	т: "t",
	у: "u",
	ф: "f",
	х: "kh",
	ц: "ts",
	ч: "ch",
	ш: "sh",
	щ: "shch",
	ь: "",
	ю: "yu",
	я: "ya",
};

export function slugifyUk(input: string): string {
	return input
		.toLowerCase()
		.replace(/['ʼ’`]/g, "")
		.split("")
		.map((char) => UK_CHAR_MAP[char] ?? char)
		.join("")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
