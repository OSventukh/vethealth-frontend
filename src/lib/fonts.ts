import { Inter, Raleway } from "next/font/google";

export const inter = Inter({ subsets: ["latin", "cyrillic"] });

// preload: false — Raleway is only used for headings; keeping its ~60 KB of
// woff2 out of the critical preloads frees bandwidth for the LCP image.
export const raleway = Raleway({
	subsets: ["latin", "cyrillic"],
	preload: false,
});
