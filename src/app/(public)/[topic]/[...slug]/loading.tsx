export default function Loading() {
	return (
		<article className="w-full">
			<div className="my-8 flex justify-center">
				<div className="h-7 w-2/3 max-w-md bg-gray-300" />
			</div>
			<div className="prose mx-auto w-full max-w-none">
				<div className="h-80 w-full bg-gray-300" />
				<div className="mt-8 space-y-4">
					<p className="h-4 w-full bg-gray-300"></p>
					<p className="h-4 w-full bg-gray-300"></p>
					<p className="h-4 w-full bg-gray-300"></p>
					<p className="h-4 w-full bg-gray-300"></p>
					<p className="h-4 w-[50%] bg-gray-300"></p>
				</div>
			</div>
		</article>
	);
}
