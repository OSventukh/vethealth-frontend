import { useGetData } from '@/hooks/data-hook';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

interface Statistics {
  posts: {
    all: number;
    draft: number;
    published: number;
  };
  users: {
    all: number;
  };
  topics: {
    all: number;
  };
}
export default function Dashboard() {
  const { data } = useGetData<Statistics>('statistics');
  return (
    <Paper sx={{ width: '100%', p: '0.5rem', textAlign: 'center' }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{ mb: 2, textAlign: 'left', padding: 2 }}
      >
        Statistics
      </Typography>

      <Grid container gap={5}>
        <Grid item>
          <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Posts</Typography>
          <List>
            <ListItem sx={{ gap: 3 }}>
              <ListItemText primary="All posts:" /> {data?.posts.all}
            </ListItem>
            <ListItem sx={{ gap: 3 }}>
              <ListItemText primary="Published posts:" />
              {data?.posts.published}
            </ListItem>
            <ListItem sx={{ gap: 3 }}>
              <ListItemText primary="Draft posts:" /> {data?.posts.draft}
            </ListItem>
          </List>
        </Grid>
        <Grid item>
          <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Topics</Typography>
          <List>
            <ListItem sx={{ gap: 3 }}>
              <ListItemText primary="All topics:" /> {data?.topics.all}
            </ListItem>
          </List>
        </Grid>
        <Grid item>
          <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Users</Typography>
          <List>
            <ListItem sx={{ gap: 3 }}>
              <ListItemText primary="All users:" /> {data?.users.all}
            </ListItem>
          </List>
        </Grid>
        <Grid item></Grid>
      </Grid>
    </Paper>
  );
}
