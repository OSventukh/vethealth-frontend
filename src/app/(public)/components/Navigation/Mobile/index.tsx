"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { CategoryResponse } from "@/api/types/categories.type";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
	items: CategoryResponse[];
};

export default function MobileNavigation({ items }: Props) {
	const params = useParams();
	const { topic } = params;
	const [open, setOpen] = useState(false);

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger className="p-2 sm:hidden">
					<Menu />
				</SheetTrigger>
				<SheetContent side="left">
					<SheetTitle className="sr-only">Меню</SheetTitle>
					<Accordion type="single" collapsible className="mt-4">
						{items.map((item) => {
							const hasChildren = Boolean(item.children?.length);
							const href = `/${topic}?category=${item.slug}`;

							if (!hasChildren) {
								return (
									<div className="border-b" key={item.id}>
										<Link
											href={href}
											className="block py-4 text-lg font-medium hover:underline"
											onClick={() => setOpen(false)}
										>
											{item.name}
										</Link>
									</div>
								);
							}

							return (
								<AccordionItem value={item.id} key={item.id}>
									<div className="flex items-center">
										<Link
											href={href}
											className="flex-1 py-4 text-lg font-medium hover:underline"
											onClick={() => setOpen(false)}
										>
											{item.name}
										</Link>
										<AccordionTrigger className="w-10 flex-none justify-center py-4 hover:no-underline">
											<span className="sr-only">
												Показати підкатегорії для {item.name}
											</span>
										</AccordionTrigger>
									</div>
									{item.children && (
										<AccordionContent>
											<ul className="grid gap-4">
												{item.children.map((child) => (
													<li key={child.id}>
														<Link
															href={`/${topic}?category=${child.slug}`}
															onClick={() => setOpen(false)}
														>
															{child.name}
														</Link>
													</li>
												))}
											</ul>
										</AccordionContent>
									)}
								</AccordionItem>
							);
						})}
					</Accordion>
				</SheetContent>
			</Sheet>
		</>
	);
}
