import React, { FormEvent, useState, useRef } from 'react';
import Image from 'next/image';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Alert from '@mui/material/Alert';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import type { AuthComponentsProps } from '@/types/auth-types';

export default function Login({
  onAuth,
  authError,
  message,
  resetPasswordMode,
  setResetPasswordMode,
}: AuthComponentsProps) {
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const loginSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();
    onAuth({ email, password });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        overflow: 'hidden',
        justifyContent: 'center',
        height: { xs: '80%', sm: '30rem' },
        width: '40rem',
        maxWidth: '90vw',
      }}
    >
      <Box
        onSubmit={loginSubmitHandler}
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1rem',
          p: '2rem',
          width: { xs: '100%', sm: '50%' },
          height: '100%',
          maxWidth: '90vw',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <img style={{ width: '20%' }} src="/logo/logo.svg" />
          </Box>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            {resetPasswordMode ? 'RESET PASSWORD' : 'LOGIN'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {authError && <Alert severity="error">{authError}</Alert>}
          {message && <Alert severity="info">{message}</Alert>}
          {!message && (
            <TextField
              required
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              variant="standard"
              inputRef={emailRef}
              sx={{
                m: 1,
              }}
            />
          )}
          <Box>
            {!resetPasswordMode && (
              <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  required
                  fullWidth
                  id="standard-adornment-password"
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  inputRef={passwordRef}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            )}
            {!message && (
              <>
                <Box>
                  <Button size="small" onClick={setResetPasswordMode}>
                    {resetPasswordMode ? 'Return to login' : 'Forgot password?'}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
        <Button type="submit" variant="contained">
          {resetPasswordMode ? 'Send confirmation Link' : 'Login'}
        </Button>
      </Box>

      <Box
        sx={{
          width: '50%',
          backgroundImage: 'url(/images/login_image.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          display: {
            xs: 'none',
            sm: 'block',
          },
        }}
      ></Box>
    </Paper>
  );
}
