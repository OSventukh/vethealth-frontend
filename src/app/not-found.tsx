import type { Metadata } from "next/types";
import Description from "@/app/(public)/components/Description";
import Footer from "@/app/(public)/components/Footer";
import Header from "@/app/(public)/components/Header";
import NotFound from "@/components/public/NotFound/NotFound";
import { NOT_FOUND_TITLE, SITE_DESCRIPTION } from "@/utils/constants/generals";

// Кореневий not-found обслуговує внутрішній роут `/_not-found`, на який
// проксі переписує неіснуючі контентні URL заради справжнього HTTP 404
// (див. `src/proxy.ts`). Без цього файлу там був би дефолтний англомовний
// екран Next замість сторінки сайту.
export const metadata: Metadata = {
	title: NOT_FOUND_TITLE,
	description: SITE_DESCRIPTION,
};

export default function RootNotFound() {
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
