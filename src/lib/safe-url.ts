const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/**
 * URL з користувацького контенту (блоки сторінок, Lexical-лінки) не можна
 * рендерити в href без алловлиста схем — збережений javascript:-URL
 * виконався б на публічному сайті.
 */
export function isSafeExternalUrl(href: string): boolean {
	try {
		return SAFE_PROTOCOLS.has(new URL(href).protocol);
	} catch {
		return false;
	}
}
