import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent, Dispatch, SetStateAction } from 'react';

import {
  Paper,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Alert,
  FormLabel,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import SwitchButton from '../UI/Switch';
import ImageUpload from '../UI/ImageUpload';
import { useGetData } from '@/hooks/data-hook';

interface EditTopicProps {
  title?: string;
  slug?: string;
  description?: string;
  activeStatus?: boolean;
  image: string | File | null;
  parentTopic: {title: string; id: number} | null;
  categories: { name: string; id: number}[] | null;
  titleChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  slugChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  descriptionChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  setImage: (Dispatch<SetStateAction<string | File | null>>);
  setActiveStatus: (Dispatch<SetStateAction<boolean>>);
  topicSubmitHandler: (event: FormEvent) => void;
  categoryChangeHandler: (event: FormEvent, value: any) => void;
  parentTopicChangeHandler: (event: FormEvent, value: any) => void;
  successMessage?: string | null;
  errorMessage?: string | null;
  buttonText?: string;
  edit?: boolean;
}

export default function EditTopic({
  title,
  slug,
  description,
  activeStatus = false,
  image,
  parentTopic,
  categories,
  titleChangeHandler,
  slugChangeHandler,
  descriptionChangeHandler,
  setImage,
  setActiveStatus,
  topicSubmitHandler,
  categoryChangeHandler,
  parentTopicChangeHandler,
  errorMessage,
  successMessage,
  edit,
}: EditTopicProps) {
  const [openParentTopic, setOpenParentTopic] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const { data: topicData, isLoading: isParentTopicLoading, mutate: topicMutate } = useGetData('topics', {
    revalidateOnMount: false
  });

  const { data: categoryData, isLoading: isCategoryLoading, mutate: categoryMutate } = useGetData('categories?parentId=null', {
    revalidateOnMount: false
  });

  useEffect(() => {
    openCategory && categoryMutate();
    openParentTopic && topicMutate();
  }, [categoryMutate, topicMutate, openCategory, openParentTopic])
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 5, textAlign: 'center', padding: 2 }}
      >
       { edit ? 'Edit Topic' : 'New Topic'}
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
            <Autocomplete
              multiple
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={categoryChangeHandler}
              onOpen={() => {
                setOpenCategory(true);
              }}
              onClose={() => {
                setOpenCategory(false);
              }}
              id="tags-standard"
              options={categoryData?.categories ?? []}
              getOptionLabel={(option: { name: string, id: number }) => option.name}
              value={categories ?? []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Topic categories"
                  placeholder="Select category"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isCategoryLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <Autocomplete
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={parentTopicChangeHandler}
              onOpen={() => {
                setOpenParentTopic(true);
              }}
              onClose={() => {
                setOpenParentTopic(false);
              }}
              id="tags-standard"
              options={topicData?.topics ?? []}
              getOptionLabel={(option: { title: string, id: number }) => option.title}
              value={parentTopic}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Parent Topic"
                  placeholder="Select topics"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isParentTopicLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
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
          <Button type="submit">{ edit ? 'Update' : 'Create' }</Button>
        </Grid>
      </Box>
    </Paper>
  );
}
