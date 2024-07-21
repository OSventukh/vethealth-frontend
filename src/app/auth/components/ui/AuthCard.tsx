import Image from 'next/image';

type Props = {
  children: React.ReactNode;
  title: string;
};

export default function AuthCard({ children, title }: Props) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-50">
      <div className="flex h-min w-[90%] overflow-hidden rounded-lg bg-background sm:w-[40rem] md:w-[45rem]">
        <div className="sm-[50%] flex h-full w-full flex-col justify-between p-5">
          <div className="flex w-full flex-col items-center gap-2">
            <Image
              src="/logo/logo.svg"
              alt="logo"
              width={500}
              height={500}
              className="w-12"
            />
            <h1 className="text-xl font-light uppercase">{title}</h1>
          </div>
          {children}
        </div>

        <Image
          src="/images/login_image.svg"
          alt="login image"
          width={1000}
          height={1000}
          style={{ objectFit: 'contain' }}
          className="hidden w-[50%] sm:block"
        />
      </div>
    </div>
  );
}
