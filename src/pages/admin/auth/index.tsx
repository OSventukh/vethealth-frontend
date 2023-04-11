import { useEffect, useState, useContext } from 'react';
import dynamic from 'next/dynamic'
import { Box } from '@mui/material';
import { fetchData } from '@/utils/fetch';

import AuthContext from '@/context/auth-context';

const Signup = dynamic(() => import('@/components/admin/Auth/Signup'));
const Login = dynamic (() => import('@/components/admin/Auth/Login'));

export default function Auth() {
  const [authType, setAuthType] = useState<'login' | 'signup' >('login');
  const { isAuth } = useContext(AuthContext);

  useEffect(() => {
    const fetching = async () => {
      try {
        const response = await fetchData('auth');

        if (response.action) {
          setAuthType(response.action);
        }
      } catch (error) {

      }
    };
    fetching();
  }, []);

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
      { authType === 'login' && !isAuth && <Login /> }
      { authType === 'signup' && !isAuth && <Signup /> }
    </Box>
  );
}
