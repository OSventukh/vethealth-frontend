import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useGetData, usePostData } from '@/hooks/data-hook';
import type { AuthHandlerArgs } from '@/types/auth-types';
import { signIn, useSession } from 'next-auth/react';

const Signup = dynamic(() => import('@/components/admin/Auth/Signup'));
const Login = dynamic(() => import('@/components/admin/Auth/Login'));

export default function Auth() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { data, error, isLoading } = useGetData<{ action: 'signup' | 'login' }>('auth');
  const [resetPasswordMode, setResetPasswordMode] = useState(false);

  const router = useRouter();

  const callbackUrl = router.query.callbackUrl;

  useEffect(() => {
    if ('confirm' in router.query) {
      setMessage('You have been successfully verified and can now login');
    }
  }, [router]);

  const { trigger: signupTrigger } = usePostData('signup');
  const { trigger: resetPasswordTrigger } = usePostData('reset-password');

  const authHandler = async ({
    firstname,
    lastname,
    email,
    password,
  }: AuthHandlerArgs) => {
    setMessage(null);
    setAuthError(null);
    try {
      if (data?.action === 'signup') {
        await signupTrigger({
          method: 'POST',
          data: {
            firstname,
            lastname,
            password,
            email,
          },
        });
        const response = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (response && !response.ok) {
          throw new Error(response?.error);
        }
        router.push('/admin');
      } else {
        if (resetPasswordMode) {
          const response = await resetPasswordTrigger({
            method: 'POST',
            data: {
              email,
            },
          });
          setMessage(response.message || 'A confirmation link has been sent to your email address')
          return;
        }
        const response = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (response && !response.ok) {
          throw new Error(response?.error);
        }
        response &&
          response.ok &&
          typeof callbackUrl === 'string' &&
          router.push(callbackUrl);
      }
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  };
  const theme = useTheme();

  return (
    <Box
      component="div"
      className="auth"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: theme.palette.background.content,
      }}
    >
      {isLoading && <CircularProgress />}
      {error && !isLoading && (
        <Alert severity="error">
          <AlertTitle>Error!</AlertTitle>
          Server connection error
        </Alert>
      )}
      {!isLoading && data && data.action === 'login' && (
        <Login
          onAuth={authHandler}
          authError={authError}
          message={message}
          resetPasswordMode={resetPasswordMode}
          setResetPasswordMode={() =>
            setResetPasswordMode((prevState) => !prevState)
          }
        />
      )}
      {!isLoading && data && data.action === 'signup' && (
        <Signup onAuth={authHandler} authError={authError} />
      )}
    </Box>
  );
}
