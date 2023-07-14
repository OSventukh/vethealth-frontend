import { useGetData } from '@/hooks/data-hook';
import Box from '@mui/material/Box';
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
  console.log(data);

  return (
    <Grid container gap={5}>
      <Grid item>
        <Card sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Posts</Typography>
          <List>
            <ListItem sx={{ gap: 3}}><ListItemText primary='All posts:'/>  {data?.posts.all}</ListItem>
            <ListItem sx={{ gap: 3}}><ListItemText primary='Published posts:'/>  {data?.posts.published}</ListItem>
            <ListItem sx={{ gap: 3}}><ListItemText primary='Draft posts:'/>  {data?.posts.draft}</ListItem>

          </List>
        </Card>
      </Grid>
      <Grid item>
        <Card sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Topics</Typography>
          <List>
            <ListItem sx={{ gap: 3}}><ListItemText primary='All topics:'/>  {data?.topics.all}</ListItem>
          </List>
        </Card>
      </Grid>
      <Grid item>
        <Card sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Users</Typography>
          <List>
            <ListItem sx={{ gap: 3}}><ListItemText primary='All users:'/>  {data?.users.all}</ListItem>
          </List>
        </Card>
      </Grid>
      <Grid item></Grid>
    </Grid>
  );
}
