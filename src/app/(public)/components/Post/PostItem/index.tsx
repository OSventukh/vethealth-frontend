import Image from "next/image";
import Link from "next/link";
import type { PostResponse } from "@/api/types/posts.type";
import { ParsedContent } from "@/app/(dashboard)/admin/components/Editor/ParsedContent";
import { raleway } from "@/lib/fonts";

type Props = {
	post: PostResponse;
	topic: string;
};

export default function PostItem({ post, topic }: Props) {
	return (
		<article className="border-border w-full overflow-hidden rounded-xl border-[1px] bg-white pb-4 transition-shadow hover:shadow-md">
			<Link href={`${topic}/${post.slug}`} className="block h-full w-full">
				{post.featuredImage && (
					<Image
						src={post.featuredImage}
						alt={post.title}
						width={500}
						height={500}
						sizes="(max-width: 768px) 100vw, 50vw"
						className="h-80 w-full object-cover"
					/>
				)}
				<header>
					<h3
						className={`${raleway.className} my-2 px-4 text-center text-lg font-[600] uppercase md:my-4`}
					>
						{post.title}
					</h3>
				</header>
				{post?.content && (
					<div className="prose px-4 py-0 md:px-8">
						<ParsedContent content={JSON.parse(post.content)} excerpt />
					</div>
				)}
				{/* <footer className="flex justify-end p-8">
          <MoveRight size={24} />
        </footer> */}
			</Link>
		</article>
	);
}
