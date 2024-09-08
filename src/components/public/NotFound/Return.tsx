'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Return() {
  const router = useRouter();
  const [isSameSite, setIsSameSite] = useState(false);

  useEffect(() => {
    const referrer = document.referrer;
    const currentHost = window.location.host;

    if (referrer) {
      const referrerHost = new URL(referrer).host;
      setIsSameSite(referrerHost === currentHost);
    }
  }, []);

  const handleBack = () => {
    if (isSameSite) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <div className="mt-8 text-center">
      <Button onClick={handleBack}>Повернутися</Button>
    </div>
  );
}