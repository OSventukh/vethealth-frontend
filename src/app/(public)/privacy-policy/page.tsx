import { Raleway } from 'next/font/google';
import { api } from '@/api';
import { notFound } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomBreadcrumb from '@/components/ui/custom/custom-breadcrumb';
import { ParsedContent } from '@/components/dashboard/Editor/ParsedContent';

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
          <div className="mt-4 rounded-xl border-[1px] border-border bg-white p-8">
            <h2
              className={`${raleway.className} my-4 text-center text-lg font-[600] uppercase`}
            >
              {privacyPolicyPage.title}
            </h2>
            <div>
              {privacyPolicyPage?.content && (
                <ParsedContent content={JSON.parse(privacyPolicyPage.content)} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}