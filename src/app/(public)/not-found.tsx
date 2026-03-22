import type { Metadata } from "next/types";
import NotFound from "@/components/public/NotFound/NotFound";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/utils/constants/generals";
import Description from "./components/Description";
import Footer from "./components/Footer";
import Header from "./components/Header";

export const metadata: Metadata = {
	title: `Сторінка не знайдена | ${SITE_TITLE}`,
	description: SITE_DESCRIPTION,
};

export default function NotFoundPage() {
	return (
		<>
			<Header />
			<main>
				<div className="container">
					<Description />
					<NotFound />
				</div>
			</main>
			<Footer />
		</>
	);
}
