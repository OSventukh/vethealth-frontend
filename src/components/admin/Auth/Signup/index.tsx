import { FormEvent, useState, useRef } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  Input,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import type { AuthComponentsProps } from '@/types/auth-types';

export default function Signup({ onAuth, authError }: AuthComponentsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const firstnameRef = useRef<HTMLInputElement>();
  const lastnameRef = useRef<HTMLInputElement>();
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const signupSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    const firstname = firstnameRef.current?.value;
    const lastname = lastnameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    onAuth({ firstname, lastname, email, password });
  };
  return (
    <Paper sx={{ display: 'flex' }}>
      <Box
        component="form"
        onSubmit={signupSubmitHandler}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          p: '2rem',
          width: '30rem',
          maxWidth: '80vw',
        }}
      >
        <Box>
          <Typography variant="h5">CREATE FIRST USER</Typography>
        </Box>
        <FormControl sx={{ m: 1, w: 'inherit' }}>
          <TextField
            required
            label="First name"
            name="firstname"
            autoComplete="given-name"
            variant="standard"
            inputRef={firstnameRef}
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <TextField
            label="Last name"
            name="firstname"
            autoComplete="family-name"
            variant="standard"
            inputRef={lastnameRef}
          />
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <TextField
            required
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            variant="standard"
            inputRef={emailRef}
          />
        </FormControl>
        <FormControl sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">
            Password
          </InputLabel>
          <Input
            required
            id="standard-adornment-password"
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
        <Button type="submit" variant="contained">
          Create
        </Button>
      </Box>
    </Paper>
  );
}
