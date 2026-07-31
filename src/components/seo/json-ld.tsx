type Props = {
	data: Record<string, unknown>;
};

// type="application/ld+json" — невиконуваний data-блок, CSP script-src
// його не блокує (nonce не потрібен). "<" екранується, щоб контент не міг
// закрити тег і вставити розмітку.
export function JsonLd({ data }: Props) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data).replaceAll("<", "\\u003c"),
			}}
		/>
	);
}
