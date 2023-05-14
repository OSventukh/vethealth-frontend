import React, { FormEvent, useState, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Alert from '@mui/material/Alert';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

import type { ConfirmComponentsProps } from '@/types/auth-types';

export default function Confirm({ onConfirm, confirmError, user }: ConfirmComponentsProps) {
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<HTMLInputElement>();
  const confirmPasswordRef = useRef<HTMLInputElement>();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const loginSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    const password = passwordRef.current?.value.trim();
    const confirmPassword = confirmPasswordRef.current?.value.trim();
    onConfirm({ confirmPassword, password })
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
          <Typography variant="h5">Hello {user.name}, enter a strong password for further login</Typography>
        </Box>
        {confirmError && <Alert severity="error">{confirmError}</Alert>}
        <Input required id="email" autoComplete='email' value={user.email} sx={{display: 'none'}}></Input>
        <FormControl sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">
            Password
          </InputLabel>
          <Input
            required
            id="new-password"
            autoComplete="new-password"
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
        <FormControl sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">
            Confirm password
          </InputLabel>
          <Input
            required
            id="confirm-password"
            autoComplete="new-password"
            type={showPassword ? 'text' : 'password'}
            inputRef={confirmPasswordRef}
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
          Sign up
        </Button>
      </Box>
    </Paper>
  );
}
