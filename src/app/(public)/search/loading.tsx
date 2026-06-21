import CustomBreadcrumb from "@/components/ui/custom/custom-breadcrumb";
import Description from "../components/Description";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PostListSkeleton from "../components/Skeletons/PostListSkeleton";

export default function SearchLoading() {
	return (
		<>
			<Header />
			<main>
				<div className="container">
					<CustomBreadcrumb
						prevPages={[{ href: "/", label: "Головна" }]}
						currentPage={{ label: "Пошук" }}
					/>
					<Description title="Пошук…" />
					<PostListSkeleton />
				</div>
			</main>
			<Footer />
		</>
	);
}
