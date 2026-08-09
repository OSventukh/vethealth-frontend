type Props = {
	itemsCount?: number;
};
export default function TopicListSkeleton({ itemsCount = 4 }: Props) {
	return (
		<div className="grid gap-8 md:grid-cols-2">
			{Array.from({ length: itemsCount }).map((_, index) => (
				<div key={index} className="flex flex-col items-center">
					<div
						key={index}
						className="h-60 w-60 rounded-2xl bg-gray-300 transition duration-300 ease-in md:hover:scale-110"
					></div>
					<div className="w-60 mt-4">
						<div className="h-4 w-full bg-gray-300"></div>
					</div>
				</div>
			))}
		</div>
	);
}
