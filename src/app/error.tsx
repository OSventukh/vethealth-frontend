"use client";

// Межа помилок для всього застосунку: сюди прилітають network/5xx-помилки
// з api-клієнта (див. request.ts) — сторінка віддається зі статусом 500,
// а не як фейковий 404.
export default function ErrorPage({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
			<h1 className="text-2xl font-semibold">Щось пішло не так</h1>
			<p className="max-w-md text-gray-600">
				Сервіс тимчасово недоступний. Спробуйте оновити сторінку за хвилину.
			</p>
			<button
				type="button"
				onClick={reset}
				className="cursor-pointer rounded-xl border border-gray-300 px-6 py-2 transition-colors hover:bg-gray-100"
			>
				Спробувати ще раз
			</button>
		</main>
	);
}
