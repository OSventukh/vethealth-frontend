import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetData } from '@/hooks/data-hook';

const Signup = dynamic(() => import('@/components/admin/Auth/Signup'));
const Login = dynamic(() => import('@/components/admin/Auth/Login'));

export default function Auth() {
  const { data, error, isLoading } = useGetData('auth', {
    revalidation: false,
  });
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
      {!isLoading && data && data.action === 'login' && <Login />}
      {!isLoading && data && data.action === 'signup' && <Signup />}
    </Box>
  );
}
