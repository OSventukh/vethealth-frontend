import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="mt-8 border-t-4 border-[#b4efe8] pt-8 text-center">
          © VetHealth
        </div>
        <nav className="flex justify-center p-2">
          <ul className="flex text-sm text-gray-600">
            <li>
              <Link href="/privacy-policy">Політика конфіденційності</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
