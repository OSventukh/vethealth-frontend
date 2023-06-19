// next imports
import Link from 'next/link';
// mui imports
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';

// type imports
import type { User } from '@/types/auth-types';

const rows = [
  {
    id: 'firstname',
    label: 'First Name',
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'role',
    label: 'Role',
  },
];
export default function UserProfile({ user }: { user: User }) {
  if (!user) {
    return <Paper>No Data</Paper>;
  }
  return (
    <Paper
      sx={{
        p: {
          xs: '2rem',
          sm: '2rem 4rem',
        },
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 2, textAlign: 'center', padding: 2 }}
      >
        Profile
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
        }}
      >
        {rows.map((row) => (
          <Box
            key={row.id}
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
            }}
          >
            <Typography
              sx={{
                textAlign: 'left',
                flexBasis: '50%',
                flexGrow: 1,
                fontWeight: 'bold',
              }}
            >
              {row.label}:
            </Typography>
            <Typography
              sx={{ textAlign: 'left', flexBasis: '50%', flexGrow: 1 }}
            >
              {user[row.id]}
            </Typography>
          </Box>
        ))}
      </Box>
      <Tooltip title="Edit profile" placement='top'>
        <Fab sx={{ position: 'absolute', right: '4rem', bottom: '4rem' }} LinkComponent={Link} href={`/admin/users/${user.id}`}>
          <EditIcon />
        </Fab>
      </Tooltip>
    </Paper>
  );
}
