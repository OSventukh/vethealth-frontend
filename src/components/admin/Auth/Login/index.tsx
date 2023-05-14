import React, { FormEvent, useState, useRef } from 'react';
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

export default function Login({ onAuth, authError, message }: AuthComponentsProps) {
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const loginSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();
    onAuth({ email, password })
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Paper sx={{ display: 'flex' }}>
      <Box
        onSubmit={loginSubmitHandler}
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          p: '2rem',
          width: '20rem',
          maxWidth: '80vw',
        }}
      >
        <Box>
          <Typography variant="h5">LOGIN</Typography>
        </Box>
        {authError && <Alert severity="error">{authError}</Alert>}
        {message && <Alert severity="info">{message}</Alert>}
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

        <FormControl sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">
            Password
          </InputLabel>
          <Input
            required
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
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Box>
    </Paper>
  );
}
