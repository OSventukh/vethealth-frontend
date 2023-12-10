import Image from 'next/image';

export default function Logo() {
  return (
    <Image
      src="/logo/vethealth-logo.svg"
      width={200}
      height={200}
      alt="Vethealth"
    />
  );
}
