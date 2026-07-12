import { slugifyUk } from "@/utils/slugify";

describe("slugifyUk", () => {
	it("транслітерує кирилицю за КМУ-2010 (як backend slugify uk)", () => {
		expect(slugifyUk("ганок гриби")).toBe("hanok-hryby");
		expect(slugifyUk("цуцик єнот йорж")).toBe("tsutsyk-yenot-yorzh");
		expect(slugifyUk("Юлія Яремчук Ївга Європа Йосип")).toBe(
			"yuliya-yaremchuk-yivha-yevropa-yosyp",
		);
		expect(slugifyUk("мед і хміль")).toBe("med-i-khmil");
	});

	it("прибирає апострофи та м'який знак", () => {
		expect(slugifyUk("м'ята")).toBe("myata");
		expect(slugifyUk("сечокамʼяна хвороба")).toBe("sechokamyana-khvoroba");
		expect(slugifyUk("сіль")).toBe("sil");
	});

	it("замінює розділові знаки на дефіси без хвостів", () => {
		expect(slugifyUk("Що їсть щур? Ранні ознаки!")).toBe(
			"shcho-yist-shchur-ranni-oznaky",
		);
		expect(slugifyUk("  Хвороби: коти — собаки  ")).toBe(
			"khvoroby-koty-sobaky",
		);
	});

	it("ідемпотентний для вже чистого слага", () => {
		expect(slugifyUk("sechokamyana-khvoroba-u-kotiv")).toBe(
			"sechokamyana-khvoroba-u-kotiv",
		);
	});

	it("зберігає латиницю та цифри", () => {
		expect(slugifyUk("Top 10 порад 2026")).toBe("top-10-porad-2026");
	});

	it("порожній рядок → порожній слаг", () => {
		expect(slugifyUk("")).toBe("");
		expect(slugifyUk("?!—")).toBe("");
	});
});
