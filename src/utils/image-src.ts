/**
 * Схема з ОПЦІЙНОЮ двокрапкою: у старому контенті трапляється покалічений
 * "https//host/…" (двокрапку загубила давня міграція). Такий src усе одно
 * абсолютний — якщо цього не помітити, до нього приклеюється домен
 * зображень і виходить "https://server…https//cdn…/images/…": браузер ріже
 * це по CSP, а next/image взагалі падає на парсингу.
 */
const SCHEME_RE = /^(https?):?\/\//i;

export const isAbsoluteImageSrc = (src: string): boolean => SCHEME_RE.test(src);

/** Відновлює загублену двокрапку; коректний URL повертає без змін. */
export const repairImageSrc = (src: string): string =>
	src.replace(SCHEME_RE, "$1://");
