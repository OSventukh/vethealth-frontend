import { api } from "@/api";
import EditCategory from "../components/EditCategory";

export default async function CategoryCreatePage() {
	const categories = await api.categories.getMany({});
	return <EditCategory categories={categories?.items || []} />;
}
