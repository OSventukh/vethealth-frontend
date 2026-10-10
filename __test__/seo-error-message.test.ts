import {
	getErrorCode,
	seoErrorMessage,
} from "@/app/(dashboard)/admin/actions/seo-error-message";

describe("seoErrorMessage", () => {
	it("prefers the backend errorCode over the status", () => {
		// Обидва — 503, але порада редактору різна.
		expect(
			seoErrorMessage({
				status: 503,
				body: { errorCode: "AI_NOT_CONFIGURED" },
			}),
		).toMatch(/додайте API-ключ/);
		expect(
			seoErrorMessage({ status: 503, body: { errorCode: "AI_KEY_REJECTED" } }),
		).toMatch(/відхилив API-ключ/);
	});

	it("tells the provider rate limit apart from our own throttler", () => {
		expect(
			seoErrorMessage({ status: 429, body: { errorCode: "AI_RATE_LIMITED" } }),
		).toMatch(/ліміт запитів до ШІ-провайдера/);
		// Тротлер бекенда коду не шле.
		expect(
			seoErrorMessage({ status: 429, body: { statusCode: 429, message: "x" } }),
		).toMatch(/Забагато запитів/);
	});

	it("uses Retry-After for the provider rate limit", () => {
		expect(
			seoErrorMessage({
				status: 429,
				body: { errorCode: "AI_RATE_LIMITED" },
				retryAfter: "12",
			}),
		).toMatch(/через 12 с/);
		expect(
			seoErrorMessage({
				status: 429,
				body: { errorCode: "AI_RATE_LIMITED" },
				retryAfter: "Wed, 21 Oct 2026 07:28:00 GMT",
			}),
		).not.toMatch(/через/);
	});

	it("falls back to the status, then to a generic message", () => {
		expect(seoErrorMessage({ status: 504 })).toMatch(/не встиг відповісти/);
		expect(seoErrorMessage({ status: 502, body: "<html>" })).toMatch(
			/не відповів/,
		);
		expect(
			seoErrorMessage({ status: 500, body: { errorCode: "AI_UNKNOWN_NEW" } }),
		).toBe("Не вдалося згенерувати мета-поля. Спробуйте ще раз");
	});
});

describe("getErrorCode", () => {
	it("reads only string codes from object bodies", () => {
		expect(getErrorCode({ errorCode: "AI_TIMEOUT" })).toBe("AI_TIMEOUT");
		expect(getErrorCode({ errorCode: 42 })).toBeUndefined();
		expect(getErrorCode("AI_TIMEOUT")).toBeUndefined();
		expect(getErrorCode(null)).toBeUndefined();
		expect(getErrorCode(undefined)).toBeUndefined();
	});
});
