import {
	computeSeoScore,
	type SeoScoreInput,
} from "@/app/(dashboard)/admin/posts/components/EditPost/seo-score";

const emptyInput: SeoScoreInput = {
	title: "",
	slug: "",
	words: 0,
	metadata: {},
};

const fullInput: SeoScoreInput = {
	title: "Сечокамʼяна хвороба у котів: ранні ознаки та профілактика",
	slug: "sechokamyana-hvoroba-u-kotiv",
	words: 900,
	metadata: {
		metaTitle: "Сечокамʼяна хвороба у котів: симптоми та профілактика",
		metaDescription:
			"Розбираємо ранні ознаки сечокамʼяної хвороби у котів, ризики, методи діагностики та поради ветеринара щодо профілактики захворювання.",
		metaKeywords: "сечокамʼяна хвороба, коти, симптоми, ветеринар",
		ogTitle: "Сечокамʼяна хвороба у котів",
		ogImage: "https://vethealth.com.ua/uploads/og.jpg",
		canonicalUrl: "https://vethealth.com.ua/blog/sechokamyana-hvoroba",
		indexable: true,
	},
};

describe("computeSeoScore", () => {
	it("порожній пост → 0", () => {
		expect(computeSeoScore(emptyInput)).toBe(0);
	});

	it("повністю заповнений пост → 100", () => {
		expect(computeSeoScore(fullInput)).toBe(100);
	});

	it("завжди в межах 0–100", () => {
		const score = computeSeoScore({
			...fullInput,
			title: "а".repeat(50),
			words: 10_000,
		});
		expect(score).toBeGreaterThanOrEqual(0);
		expect(score).toBeLessThanOrEqual(100);
	});

	it("часткові бали за поля поза ідеальним діапазоном", () => {
		const short = computeSeoScore({
			...emptyInput,
			title: "Коротко",
		});
		const ideal = computeSeoScore({
			...emptyInput,
			title: "а".repeat(50),
		});
		expect(short).toBeGreaterThan(0);
		expect(ideal).toBeGreaterThan(short);
	});

	it("кирилиця чи великі літери у слагу — лише часткові бали", () => {
		const valid = computeSeoScore({ ...emptyInput, slug: "valid-slug" });
		const invalid = computeSeoScore({ ...emptyInput, slug: "Невалідний Слаг" });
		expect(valid).toBeGreaterThan(invalid);
		expect(invalid).toBeGreaterThan(0);
	});

	it("3+ ключових слова дають більше, ніж одне", () => {
		const one = computeSeoScore({
			...emptyInput,
			metadata: { metaKeywords: "коти" },
		});
		const three = computeSeoScore({
			...emptyInput,
			metadata: { metaKeywords: "коти, собаки, гризуни" },
		});
		expect(three).toBeGreaterThan(one);
	});

	it("indexable=false знижує бал", () => {
		const indexable = computeSeoScore(fullInput);
		const notIndexable = computeSeoScore({
			...fullInput,
			metadata: { ...fullInput.metadata, indexable: false },
		});
		expect(indexable - notIndexable).toBe(5);
	});
});
