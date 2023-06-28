import { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import Loading from '@/components/admin/UI/Loading';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useGetData, usePostData } from '@/hooks/data-hook';
import type { ConfirmHandlerArgs } from '@/types/auth-types';

const Confirm = dynamic(() => import('@/components/admin/Auth/Confirm'), {
  ssr: false,
  loading: () => <Loading />
});

export default function ConfirmPage() {
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const router = useRouter();

  const token = router.query.token;

  const { data, error, isLoading } = useGetData<{ userName: string; userEmail: string }>(token && `confirm/${token}`);

  const { trigger } = usePostData('confirm');

  const confirmHandler = async ({
    password,
    confirmPassword,
  }: ConfirmHandlerArgs) => {
    setConfirmError(null);
    try {
      const response = await trigger({
        method: 'POST',
        data: {
          token,
          password,
          confirmPassword,
        },
      });
      router.replace('/admin?confirm');
    } catch (error) {
      setConfirmError(
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
      {error && !isLoading && (
        <Alert severity="error">
          <AlertTitle>Error!</AlertTitle>
          {error.message}
        </Alert>
      )}
      {data && !isLoading && <Confirm onConfirm={confirmHandler} confirmError={confirmError} user={{ name: data?.userName, email: data?.userEmail }} />}
    </Box>
  );
}
