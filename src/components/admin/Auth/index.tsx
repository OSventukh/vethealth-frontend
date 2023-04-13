import { useContext } from 'react';
import dynamic from 'next/dynamic'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useData } from '@/hooks/data-hook';
import AuthContext from '@/context/auth-context';

const Signup = dynamic(() => import('@/components/admin/Auth/Signup'));
const Login = dynamic (() => import('@/components/admin/Auth/Login'));

export default function Auth() {
  const { data, error, isLoading } = useData('auth', {}, false);

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
      { error && !isLoading && <p>error</p>}
      { isLoading && <CircularProgress /> }
      { !isLoading && data && data.action === 'login' && <Login /> }
      { !isLoading && data && data.action === 'signup' && <Signup /> }
    </Box>
  );
}
