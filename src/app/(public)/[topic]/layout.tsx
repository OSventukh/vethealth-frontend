import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function TopicLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {
    topic: string;
  };
}) {
 
  return (
    <>
      <Header topic={params.topic} />
      <main>
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
