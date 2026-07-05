"use client";

import { preconnect } from "react-dom";

// React Float: calling preconnect() during render (including SSR) emits a
// <link rel="preconnect"> in <head>. A plain <link> in a Server Component
// layout is dropped by React, so this tiny client component is the
// documented way to warm up a cross-origin connection.
export function Preconnect({ href }: { href: string }) {
	preconnect(href);
	return null;
}
