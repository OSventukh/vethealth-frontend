import Image from "next/image";
import { raleway } from "@/lib/fonts";
import type { TeamBlockData } from "@/lib/page-builder/types";

export function TeamBlock({ data }: { data: TeamBlockData }) {
	if (!data.members.length) return null;
	return (
		<section className="py-10">
			{data.title && (
				<h2
					className={`${raleway.className} mb-8 text-center text-2xl font-bold md:text-3xl`}
				>
					{data.title}
				</h2>
			)}
			<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
				{data.members.map((member, i) => (
					<div key={`${member.name}-${i}`} className="text-center">
						{member.photoUrl ? (
							<Image
								src={member.photoUrl}
								alt={member.name}
								width={300}
								height={300}
								sizes="(max-width: 768px) 50vw, 280px"
								className="aspect-square h-auto w-full rounded-xl object-cover"
							/>
						) : (
							<div className="bg-muted aspect-square w-full rounded-xl" />
						)}
						<div className="mt-3 font-bold">{member.name}</div>
						<div className="text-primary mt-0.5 text-sm">{member.role}</div>
					</div>
				))}
			</div>
		</section>
	);
}
