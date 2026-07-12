import {
	ArrowLeft,
	FileTextIcon,
	SearchIcon,
	SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
	editMode?: boolean;
};

const triggerClassName =
	"gap-2 data-active:bg-primary data-active:text-primary-foreground";

export function PostEditorHeader({ editMode }: Props) {
	return (
		<div className="mb-4 flex w-full flex-wrap items-center justify-between gap-4">
			<div className="flex items-center gap-3">
				<Button asChild variant="outline" size="icon" title="До списку статей">
					<Link href="/admin/posts">
						<ArrowLeft size={16} />
					</Link>
				</Button>
				<div>
					<div className="text-muted-foreground flex items-center gap-2 text-xs">
						<Link href="/admin/posts" className="hover:text-foreground">
							Пости
						</Link>
						<span>/</span>
						<span className="text-foreground font-semibold">Редактор</span>
					</div>
					<h1 className="text-xl font-bold md:text-2xl">
						{editMode ? "Редагування статті" : "Нова стаття"}
					</h1>
				</div>
			</div>

			<TabsList className="h-11">
				<TabsTrigger value="content" className={triggerClassName}>
					<FileTextIcon size={15} />
					Контент
				</TabsTrigger>
				<TabsTrigger value="seo" className={triggerClassName}>
					<SearchIcon size={15} />
					SEO та метадані
				</TabsTrigger>
				<TabsTrigger value="settings" className={triggerClassName}>
					<SettingsIcon size={15} />
					Налаштування
				</TabsTrigger>
			</TabsList>
		</div>
	);
}
