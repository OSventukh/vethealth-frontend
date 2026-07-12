import { isAbsoluteImageSrc, repairImageSrc } from "@/utils/image-src";

describe("repairImageSrc", () => {
	it("відновлює загублену двокрапку в схемі", () => {
		expect(
			repairImageSrc("https//staging-cdn.vethealth.com.ua/images/posts/a.png"),
		).toBe("https://staging-cdn.vethealth.com.ua/images/posts/a.png");
		expect(repairImageSrc("http//host/x.png")).toBe("http://host/x.png");
	});

	it("не чіпає коректні URL (ідемпотентно)", () => {
		const url = "https://cdn.vethealth.com.ua/images/posts/a.png";
		expect(repairImageSrc(url)).toBe(url);
		expect(repairImageSrc(repairImageSrc(url))).toBe(url);
	});

	it("не чіпає відносні шляхи та голі ключі", () => {
		expect(repairImageSrc("/uploads/a.png")).toBe("/uploads/a.png");
		expect(repairImageSrc("images/posts/a.png")).toBe("images/posts/a.png");
	});
});

describe("isAbsoluteImageSrc", () => {
	it("покалічений URL усе одно вважається абсолютним", () => {
		// Інакше до нього приклеїться домен зображень і вийде
		// "https://server…https//cdn…" — CSP таке ріже.
		expect(isAbsoluteImageSrc("https//cdn.host/images/a.png")).toBe(true);
	});

	it("розпізнає звичайні абсолютні URL", () => {
		expect(isAbsoluteImageSrc("https://cdn.host/a.png")).toBe(true);
		expect(isAbsoluteImageSrc("http://cdn.host/a.png")).toBe(true);
	});

	it("відносні шляхи — не абсолютні", () => {
		expect(isAbsoluteImageSrc("/uploads/a.png")).toBe(false);
		expect(isAbsoluteImageSrc("images/posts/a.png")).toBe(false);
	});
});
