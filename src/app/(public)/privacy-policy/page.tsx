import { Raleway } from 'next/font/google';
import { api } from '@/api';
import { notFound } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomBreadcrumb from '@/components/ui/custom/custom-breadcrumb';
import { ParsedContent } from '@/app/(dashboard)/admin/components/Editor/ParsedContent';

const raleway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default async function PrivacyPolicyPage() {
  const privacyPolicyPage = await api.pages.getOne({
    slug: 'privacy-policy',
    tags: ['pages'],
  });

  if (!privacyPolicyPage) return notFound();

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <CustomBreadcrumb
            prevPages={[{ href: '/', label: 'Головна' }]}
            currentPage={{ label: 'Політика конфіденційності' }}
          />
          <div className="border-border mt-4 rounded-xl border-[1px] bg-white p-8">
            <h1
              className={`${raleway.className} my-4 text-center text-lg font-[600] uppercase`}
            >
              {privacyPolicyPage.title}
            </h1>
            <div className="prose prose-headings:text-sm max-w-none">
              {privacyPolicyPage?.content && (
                <ParsedContent
                  content={JSON.parse(privacyPolicyPage.content)}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
