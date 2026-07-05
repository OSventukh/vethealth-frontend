import PostListSkeleton from "../components/Skeletons/PostListSkeleton";

export default function Loading() {
	return (
		<div>
			<div className="my-8 flex justify-center">
				<div className="h-7 w-64 bg-gray-300" />
			</div>
			<PostListSkeleton />
		</div>
	);
}
