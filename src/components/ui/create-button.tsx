import Link from 'next/link';

type Props = {
  link: string;
  icon: React.ReactNode;
  text: string;
};

export default function CreateButton({ link, icon, text }: Props) {
  return (
    <div className="mt-4 flex w-full md:mt-0">
      <Link
        href={link}
        className="bg-primary flex items-center justify-center gap-2 rounded-xl p-3 py-2 text-sm text-white shadow-lg hover:opacity-90"
      >
        {icon} {text}
      </Link>
    </div>
  );
}
