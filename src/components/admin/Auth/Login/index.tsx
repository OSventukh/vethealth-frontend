import React, { FormEvent, useState, useRef, useContext } from 'react';
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

import AuthContext from '@/context/auth-context';
import { fetchData } from '@/utils/fetch';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const { login } = useContext(AuthContext);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const loginSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
  
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    try {
      setError(null);
      const response = await fetchData('login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        })
      })
      login(response.accessToken, response.user);
      
    } catch (error) {
      error instanceof Error && setError(error.message);
    }
  }
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
        {error && <Alert severity="error">{error}</Alert>}
        <FormControl sx={{ m: 1 }}>
          <TextField
            required
            label="Email"
            name="email"
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
