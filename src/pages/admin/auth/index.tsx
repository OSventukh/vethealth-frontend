import { useEffect, useState, useContext } from 'react';
import { Box } from '@mui/material';
import { fetchData } from '@/utils/fetch';
import Signup from '@/components/admin/Auth/Signup';
import Login from '@/components/admin/Auth/Login';
import AuthContext from '@/context/auth-context';

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
