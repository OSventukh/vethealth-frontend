import Link from 'next/link';

type Props = {
  link: string;
  icon: any;
  text: string;
};

export default function CreateButton({
  link,
  icon,
  text,
}: Props) {
  return (
    <div className="flex w-full mt-4 md:mt-0">
      <Link
        href={link}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary p-3 py-2 text-sm text-white shadow-lg hover:opacity-90"
      >
        {icon} {text}
      </Link>
    </div>
  );
}
