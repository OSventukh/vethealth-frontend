import SignIn from '@/app/auth/components/SignIn';
import { Suspense } from 'react';
import Forgot from '../components/Forgot';

type Props = {
  searchParams: {
    forgotPassword?: string;
  };
};
export default function LoginPage({ searchParams }: Props) {
  const { forgotPassword } = searchParams;
  return (
    <Suspense>
      {!forgotPassword && <SignIn />}
      {forgotPassword && <Forgot />}
    </Suspense>
  );
}
