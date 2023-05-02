import { useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetData, usePostData } from '@/hooks/data-hook';
import AuthContext from '@/context/auth-context';
import type { AuthHandlerArgs } from '@/types/auth-types';

const Signup = dynamic(() => import('@/components/admin/Auth/Signup'));
const Login = dynamic(() => import('@/components/admin/Auth/Login'));

export default function Auth() {
  const [authError, setAuthError] = useState<string | null>(null);
  const { login } = useContext(AuthContext);

  const { data, error, isLoading } = useGetData('auth', {
    revalidation: false,
  });

  const { trigger } = usePostData(data?.action);

  const authHandler = async ({firstname, lastname, email, password}: AuthHandlerArgs) => {
    try {
      const response = await trigger({
        method: 'POST',
        data: {
          firstname,
          lastname,
          password,
          email,
        }
      })
      login();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }
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
      {error && !isLoading && <p>error</p>}
      {!isLoading && data && data.action === 'login' && <Login onAuth={authHandler} authError={authError} />}
      {!isLoading && data && data.action === 'signup' && <Signup onAuth={authHandler} authError={authError} />}
    </Box>
  );
}
