import { useFormContext } from "react-hook-form";
import type { CategoryResponse } from "@/api/types/categories.type";
import type { TopicResponse } from "@/api/types/topics.type";
import { Card } from "@/components/ui/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { MultiCombobox } from "@/components/ui/multi-combobox";
import type { PostValues } from "@/utils/validators/form.validator";

type Props = {
	topicsOptions?: TopicResponse[];
	categoriesOptions?: CategoryResponse[];
};

export function ClassificationCard({
	topicsOptions,
	categoriesOptions,
}: Props) {
	const form = useFormContext<PostValues>();

	return (
		<Card className="flex flex-col gap-4 p-5">
			<div className="text-sm font-bold">Класифікація</div>
			<FormField
				control={form.control}
				name="topics"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Тема</FormLabel>
						<FormControl>
							<MultiCombobox
								options={topicsOptions || []}
								value={field.value}
								onChange={field.onChange}
								labelKey="title"
								placeholder="Виберіть теми…"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="categories"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Категорія</FormLabel>
						<FormControl>
							<MultiCombobox
								options={categoriesOptions || []}
								value={field.value}
								onChange={field.onChange}
								labelKey="name"
								placeholder="Виберіть категорії…"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</Card>
	);
}
