type Props = {
  itemsCount?: number;
};
export default function PostListSkeleton({ itemsCount = 4 }: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {Array.from({ length: itemsCount }).map((_, index) => (
        <article
          key={index}
          className="border-border w-full overflow-hidden rounded-xl border-[1px] bg-white pb-4 transition-shadow hover:shadow-md"
        >
          <div className="block h-full w-full">
            <div className="h-80 w-full bg-gray-300 object-cover" />

            <header>
              <div className="md:my-4h-4 my-2 w-full bg-gray-300 px-4 text-center text-lg font-[600] uppercase"></div>
            </header>
            <div>
              <div className="prose px-4 py-0 md:px-8">
                <p className="h-4 w-full bg-gray-300"></p>
                <p className="h-4 w-full bg-gray-300"></p>
                <p className="h-4 w-full bg-gray-300"></p>
                <p className="h-4 w-full bg-gray-300"></p>
                <p className="h-4 w-[50%] bg-gray-300"></p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
