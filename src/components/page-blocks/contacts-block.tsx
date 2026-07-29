import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { raleway } from "@/lib/fonts";
import type { ContactsBlockData } from "@/lib/page-builder/types";

function ContactRow({
	icon,
	label,
	value,
	href,
}: {
	icon: ReactNode;
	label: string;
	value: string;
	href?: string;
}) {
	if (!value) return null;
	return (
		<div className="flex items-start gap-3">
			<span className="bg-primary/10 text-primary mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
				{icon}
			</span>
			<div>
				<div className="text-muted-foreground text-xs tracking-wider uppercase">
					{label}
				</div>
				{href ? (
					<a href={href} className="mt-0.5 block font-semibold hover:underline">
						{value}
					</a>
				) : (
					<div className="mt-0.5 font-semibold">{value}</div>
				)}
			</div>
		</div>
	);
}

export function ContactsBlock({ data }: { data: ContactsBlockData }) {
	return (
		<section className="py-10">
			{data.title && (
				<h2
					className={`${raleway.className} mb-6 text-center text-2xl font-bold md:text-3xl`}
				>
					{data.title}
				</h2>
			)}
			<div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
				<ContactRow
					icon={<MapPin className="h-4 w-4" />}
					label="Адреса"
					value={data.address}
				/>
				<ContactRow
					icon={<Phone className="h-4 w-4" />}
					label="Телефон"
					value={data.phone}
					href={
						data.phone ? `tel:${data.phone.replace(/[^+\d]/g, "")}` : undefined
					}
				/>
				<ContactRow
					icon={<Mail className="h-4 w-4" />}
					label="Email"
					value={data.email}
					href={data.email ? `mailto:${data.email}` : undefined}
				/>
				<ContactRow
					icon={<Clock className="h-4 w-4" />}
					label="Графік"
					value={data.schedule}
				/>
			</div>
		</section>
	);
}
