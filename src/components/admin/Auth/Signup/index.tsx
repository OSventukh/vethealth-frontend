import { useState } from 'react';
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

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
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
      <Paper sx={{ display: 'flex',  }}>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            p: '2rem',
            width: '30rem',
            maxWidth: '80vw'
          }}
        >
          <Box>
            <Typography variant='h5'>CREATE FIRST USER</Typography>
          </Box>
          <FormControl sx={{ m: 1, w: 'inherit' }}>
            <TextField
              required
              label="First name"
              name="firstname"
              autoComplete="given-name"
              variant="standard"
            />
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <TextField
              label="Last name"
              name="firstname"
              autoComplete="family-name"
              variant="standard"
            />
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <TextField
              required
              label="Email"
              name="email"
              autoComplete="email"
              variant="standard"
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
          <Button type='submit' variant="contained">Create</Button>
        </Box>
      </Paper>
    </Box>
  );
}
