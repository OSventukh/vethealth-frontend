// `next/cache` тягне серверні модулі Next (response-cache → stream-utils →
// web/spec-extension), яким потрібні Request/Response/TextEncoder — у jsdom
// їх немає, тож будь-який компонент із ланцюжком до `cacheTag` не імпортувався
// б у тестах. Кешування — серверна поведінка, у рендер-тестах не перевіряється.
module.exports = {
	cacheTag: () => {},
	cacheLife: () => {},
	revalidateTag: () => {},
	revalidatePath: () => {},
	updateTag: () => {},
	unstable_cache: (fn) => fn,
};
