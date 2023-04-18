import { FormEvent, useState, ChangeEvent, Dispatch, SetStateAction } from 'react';

import {
  Paper,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Alert,
  FormLabel,
} from '@mui/material';
import SwitchButton from '../UI/Switch';
import ImageUpload from '../UI/ImageUpload';

interface EditTopicProps {
  title?: string;
  slug?: string;
  description?: string;
  activeStatus?: boolean;
  image: string | File | null;
  titleChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  slugChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  descriptionChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  setImage: (Dispatch<SetStateAction<string | File | null>>);
  setActiveStatus: (Dispatch<SetStateAction<boolean>>);
  topicSubmitHandler: (event: FormEvent) => void;
  successMessage?: string | null;
  errorMessage?: string | null;
  buttonText?: string;
}

export default function EditTopic({
  title,
  slug,
  description,
  activeStatus = false,
  image,
  titleChangeHandler,
  slugChangeHandler,
  descriptionChangeHandler,
  setImage,
  setActiveStatus,
  topicSubmitHandler,
  errorMessage,
  successMessage,
  buttonText = 'Create',
}: EditTopicProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 5, textAlign: 'center', padding: 2 }}
      >
        New topic
      </Typography>
      <Box component="form" onSubmit={topicSubmitHandler}>
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
            <FormLabel
              sx={{ display: 'flex', gap: '4rem', alignItems: 'center', mt: 1 }}
            >
              Active:
              <SwitchButton
                checked={activeStatus}
                onChange={() => setActiveStatus((prevState) => !prevState)}
              />
            </FormLabel>
          </Grid>
          <Grid item>
            <ImageUpload onImage={setImage} value={image} />
          </Grid>
        </Grid>
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Button type="submit">{buttonText}</Button>
        </Grid>
      </Box>
    </Paper>
  );
}
