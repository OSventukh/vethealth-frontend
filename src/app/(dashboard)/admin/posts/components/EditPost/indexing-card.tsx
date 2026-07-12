import { useFormContext } from "react-hook-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { PostValues } from "@/utils/validators/form.validator";

const ROBOTS_FIELDS = [
	{
		name: "metadata.indexable",
		label: "index",
		hint: "Дозволити індексацію сторінки пошуковими системами",
	},
	{
		name: "metadata.followable",
		label: "follow",
		hint: "Передавати вагу посилань на сторінці",
	},
] as const;

export function IndexingCard() {
	const form = useFormContext<PostValues>();

	return (
		<Card>
			<CardHeader className="pb-4">
				<CardTitle className="text-sm font-bold">Індексація</CardTitle>
				<CardDescription>Robots-директиви для пошукових систем</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-3 md:grid-cols-2">
				{ROBOTS_FIELDS.map((robotsField) => (
					<FormField
						key={robotsField.name}
						control={form.control}
						name={robotsField.name}
						render={({ field }) => (
							<FormItem>
								<label className="border-input has-data-checked:border-primary/40 has-data-checked:bg-primary/5 flex cursor-pointer items-center gap-3 rounded-lg border p-3">
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<span className="leading-tight">
										<span className="block font-mono text-sm font-semibold">
											{robotsField.label}
										</span>
										<span className="text-muted-foreground block text-xs">
											{robotsField.hint}
										</span>
									</span>
								</label>
							</FormItem>
						)}
					/>
				))}
			</CardContent>
		</Card>
	);
}
