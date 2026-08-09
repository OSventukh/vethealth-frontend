import { getCategoriesByTopic } from "../../_lib/content-cache";
import DesktopNavigation from "./Desktop";
import MobileNavigation from "./Mobile";
import SearchBar from "./Search";

export default async function Navigation({
	topic,
}: {
	topic?: string | Promise<string>;
}) {
	const topicSlug = await topic;
	const categories = await getCategoriesByTopic(topicSlug);

	const isCategories = topicSlug && categories && categories?.count > 0;

	return (
		<div className="flex items-center">
			{isCategories && <DesktopNavigation items={categories?.items || []} />}
			<div className="flex items-center gap-4">
				<SearchBar />
				{isCategories && <MobileNavigation items={categories?.items || []} />}
			</div>
		</div>
	);
}
