import { useContext } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import useData from '@/hooks/data-hook';
import AuthContext from '@/context/auth-context';

const Signup = dynamic(() => import('@/components/admin/Auth/Signup'));
const Login = dynamic (() => import('@/components/admin/Auth/Login'));

export default function Auth() {
  const { isAuth } = useContext(AuthContext);
  const router = useRouter();
  const { data, error, isLoading } = useData('auth');

 
  if (error) {
    router.push('/500');
    return null;
  }

  return (
    <Box
      component="div"
      className="auth"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f5f5f5',
      }}
    >
      { isLoading && <CircularProgress /> }
      { !isLoading && data.action === 'login' && !isAuth && !isLoading && <Login /> }
      { !isLoading && data.action === 'signup' && !isAuth && <Signup /> }
    </Box>
  );
}
