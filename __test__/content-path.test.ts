import { isContentPath } from "@/lib/content-path";

// Проксі 404-ить усе, що `isContentPath` визнав контентом і чого не знайшов
// у бекенді. Тож хибний true тут = живий роут віддає 404. Новий топ-рівневий
// роут або тека в public/ мусять зʼявитися в RESERVED_SEGMENTS — цей тест
// падає, якщо про це забули.
describe("isContentPath", () => {
	it("treats topic and post urls as content", () => {
		expect(isContentPath("/dogs")).toBe(true);
		expect(isContentPath("/dogs/ntcn")).toBe(true);
		expect(isContentPath("/drugs/antiparasitic-drugs")).toBe(true);
	});

	it("ignores the home page", () => {
		expect(isContentPath("/")).toBe(false);
	});

	it.each([
		"/search",
		"/search?query=test",
		"/privacy-policy",
		"/auth/login",
		"/admin",
		"/admin/posts",
	])("ignores the app route %s", (path) => {
		expect(isContentPath(new URL(path, "http://x").pathname)).toBe(false);
	});

	it.each([
		"/sitemap.xml",
		"/robots.txt",
		"/llms.txt",
		"/ads.txt",
		"/favicon.ico",
		"/images/logo.png",
		"/js/optimize.js",
		"/social/social.jpg",
		"/_next/data/build/page.json",
	])("ignores the non-content path %s", (path) => {
		expect(isContentPath(path)).toBe(false);
	});
});
