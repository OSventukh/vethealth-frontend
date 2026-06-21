"use client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import Form from "next/form";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PostResponse } from "@/api/types/posts.type";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/custom/loading";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const MIN_QUERY_LENGTH = 3;

const ParsedContent = dynamic(
	() =>
		import("@/app/(dashboard)/admin/components/Editor/ParsedContent").then(
			(module) => module.ParsedContent,
		),
	{
		ssr: false,
	},
);

export default function SearchBar() {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [searchResults, setSearchResults] = useState<PostResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	const getSearchResults = async (query: string) => {
		try {
			const normalizedQuery = query.trim();

			if (normalizedQuery.length < MIN_QUERY_LENGTH) return;

			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			abortControllerRef.current = new AbortController();

			setLoading(true);
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_SERVER}/search?query=${encodeURIComponent(normalizedQuery)}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					cache: "no-store",
					signal: abortControllerRef.current.signal,
				},
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Помилка пошуку");
			}

			if (data.count > 0) {
				setSearchResults(data.items);
			} else {
				setSearchResults([]);
			}
			setLoading(false);
		} catch (error: unknown) {
			setLoading(false);
			if (error instanceof Error && error.name === "AbortError") {
				console.error("Запит було скасовано");
			} else {
				console.error("Error fetching search results:", error);
			}
		}
	};

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [query]);

	useEffect(() => {
		const normalizedQuery = debouncedQuery.trim();

		if (normalizedQuery.length >= MIN_QUERY_LENGTH) {
			getSearchResults(normalizedQuery);
		} else {
			setSearchResults([]);
		}
	}, [debouncedQuery]);

	return (
		<>
			<Sheet>
				<SheetTrigger className="cursor-pointer p-2 md:p-4" title="Пошук">
					<Search />
				</SheetTrigger>
				<VisuallyHidden asChild>
					<SheetTitle>Пошук</SheetTitle>
				</VisuallyHidden>
				<SheetContent side="top" className="bg-[rgb(180,239,232)] px-0">
					<div className="container">
						{/* next/form builds `/search?query=…` from the input's `name`
						    and navigates (prefetch + works without JS). We only block
						    submits that are too short. */}
						<Form
							action="/search"
							onSubmit={(event) => {
								if (query.trim().length < MIN_QUERY_LENGTH) {
									event.preventDefault();
								}
							}}
							className="flex flex-col gap-2 sm:gap-4"
						>
							<label htmlFor="search-query" className="text-sm font-medium">
								Пошук:
							</label>
							<div className="flex gap-2">
								<Input
									id="search-query"
									name="query"
									className="bg-background/80 border-none"
									placeholder="Пошук"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
								/>
								<div>
									<Button
										className="aspect-square cursor-pointer p-1"
										variant="default"
										type="submit"
									>
										<Search size={20} />
									</Button>
								</div>
							</div>
							<div className="h-2 text-sm text-red-600">
								{query.trim().length > 0 &&
									query.trim().length < MIN_QUERY_LENGTH &&
									"Введіть щонайменше 3 символи"}
							</div>
						</Form>

						{loading && (
							<div className="flex justify-center">
								<div className="h-[24px] w-[24px]">
									<LoadingSpinner />
								</div>
							</div>
						)}
						{searchResults.length > 0 && !loading && (
							<>
								<div className="h-px w-full bg-white" />
								<ul className="mt-4 max-h-[calc(100vh-9rem)] w-full space-y-2 overflow-y-auto">
									{searchResults.map((item) => (
										<li key={item.id}>
											<SheetClose asChild>
												<Link href={`/${item.topics![0].slug}/${item.slug}`}>
													<Card className="overflow-hidden border-none">
														<div className="flex">
															<div className="p-2">
																<h2 className="text-lg">{item.title}</h2>
																<div>
																	<ParsedContent
																		content={JSON.parse(item.content)}
																		excerpt
																	/>
																</div>
															</div>
														</div>
													</Card>
												</Link>
											</SheetClose>
										</li>
									))}
								</ul>
							</>
						)}

						{!loading &&
							query.length >= MIN_QUERY_LENGTH &&
							searchResults.length === 0 && (
								<>
									<div className="h-[1px] w-full bg-white" />
									<div className="mt-2">Результатів немає</div>
								</>
							)}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
