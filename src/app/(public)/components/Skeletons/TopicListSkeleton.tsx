type Props = {
  itemsCount?: number;
};
export default function TopicListSkeleton({ itemsCount = 4 }: Props) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {Array.from({ length: itemsCount }).map((_, index) => (
        <div>
          <div
            key={index}
            className="h-[240px] w-[240px] rounded-2xl bg-gray-300 transition duration-300 ease-in md:hover:scale-110"
          ></div>
          <div className="mt-4">
            <div className="h-4 w-full bg-gray-300"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
