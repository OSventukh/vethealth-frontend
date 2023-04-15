import { FormEvent, useContext, useState, ChangeEvent } from 'react';
import { fetchData } from '@/utils/fetch';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Alert,
} from '@mui/material';
import AuthContext from '@/context/auth-context';
import ImageUpload from '../UI/ImageUpload';

export default function NewTopic() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const { accessToken } = useContext(AuthContext);

  const titleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const enteredTitle = event.target.value;
    setTitle(enteredTitle);
  };
  const slugChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const enteredSlug = event.target.value;
    setSlug(enteredSlug);
  };
  const descriptionChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const enteredDescription = event.target.value;
    setDescription(enteredDescription);
  };

  const imageHandler = (image: File | null) => {
    setImage(image);
  };

  const newTopicSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title || title.trim().length === 0) {
      setErrorMessage('Title should not be empty');
    }

    const formData = new FormData();
    title && formData.append('title', title);
    slug && formData.append('slug', slug);
    description && formData.append('descritption', description);
    image && formData.append('topic-image', image);
    try {
      const response = await fetchData('topics', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      setSuccessMessage(response.message);
      setImage(null);
      setTitle('');
      setSlug('');
      setDescription('');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Something went wrong');
      }
    }
  };
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 5, textAlign: 'center', padding: 2 }}
      >
        New topic
      </Typography>
      <Box component="form" onSubmit={newTopicSubmitHandler}>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          spacing={2}
        >
          <Grid container item direction="column" xs={10} sm={6} gap={2}>
            {successMessage && (
              <Alert variant="filled" severity="success">
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert variant="filled" severity="error">
                {errorMessage}
              </Alert>
            )}
            <TextField
              id="standard-basic"
              label="Title"
              variant="standard"
              onChange={titleChangeHandler}
              value={title}
            />

            <TextField
              id="standard-basic"
              label="Slug"
              variant="standard"
              onChange={slugChangeHandler}
              value={slug}
            />

            <TextField
              id="standard-basic"
              label="Description"
              variant="standard"
              multiline
              onChange={descriptionChangeHandler}
              value={description}
            />
          </Grid>
          <Grid item>
            <ImageUpload onImage={imageHandler} value={image} />
          </Grid>
        </Grid>
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Button type="submit">Create</Button>
        </Grid>
      </Box>
    </Paper>
  );
}
