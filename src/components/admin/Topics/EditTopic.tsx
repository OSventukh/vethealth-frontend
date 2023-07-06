import { useState, useEffect } from 'react';
import type { EditTopic } from '@/types/props-types';

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
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import SwitchButton from '../UI/Switch';
import ImageUpload from '../UI/ImageUpload';

import { useGetData } from '@/hooks/data-hook';
import type { Category, Topic, Page } from '@/types/content-types';
import { TopicContent } from '@/utils/constants/content.enum';

export default function EditTopic({
  id,
  title,
  slug,
  description,
  activeStatus = false,
  image,
  parentTopic,
  categories,
  page,
  content,
  titleChangeHandler,
  slugChangeHandler,
  descriptionChangeHandler,
  setImage,
  setActiveStatus,
  topicSubmitHandler,
  categoryChangeHandler,
  parentTopicChangeHandler,
  pageChangeHandler,
  contentChangeHandler,
  childrenTopic,
  errorMessage,
  successMessage,
  edit,
}: EditTopic) {
  const [openParentTopic, setOpenParentTopic] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openPage, setOpenPage] = useState(false);

  const {
    data: topicData,
    isLoading: isParentTopicLoading,
    mutate: topicMutate,
  } = useGetData<{topics: Topic[]}>('topics?parentId=null', {
    revalidateOnMount: false,
  });

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    mutate: categoryMutate,
  } = useGetData<{categories: Category[]}>('categories?parentId=null', {
    revalidateOnMount: false,
  });

  const {
    data: pageData,
    isLoading: isPageLoading,
    mutate: pageMutate,
  } = useGetData<{pages: Page[]}>('pages', {
    revalidateOnMount: false,
  });

  useEffect(() => {
    openCategory && categoryMutate();
    openParentTopic && topicMutate();
    openPage && pageMutate();
  }, [
    categoryMutate,
    topicMutate,
    pageMutate,
    openPage,
    openCategory,
    openParentTopic,
  ]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 2, textAlign: 'center', padding: 2 }}
      >
        {edit ? 'Edit Topic' : 'New Topic'}
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
              id="topic-title"
              label="Title"
              variant="standard"
              onChange={titleChangeHandler}
              value={title}
            />

            <TextField
              id="topic-slug"
              label="Slug"
              variant="standard"
              onChange={slugChangeHandler}
              value={slug}
            />

            <TextField
              id="topic-description"
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
              id="topic-categories"
              options={categoryData?.categories || []}
              getOptionLabel={(option: Category) =>
                option.name
              }
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
            {childrenTopic && childrenTopic.length > 0 ? (
              <Alert severity="info">This topic contains child topics, so it is not possible to add a parent topic</Alert>
            ) : (
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={parentTopicChangeHandler}
                onOpen={() => {
                  setOpenParentTopic(true);
                }}
                onClose={() => {
                  setOpenParentTopic(false);
                }}
                id="topic-parent-topic"
                options={
                  id
                    ? topicData?.topics?.filter(
                        (topic: Topic) => topic.id !== id
                      ) || []
                    : topicData?.topics || []
                }
                getOptionLabel={(option: Topic) =>
                  option.title
                }
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
            )}
            <FormControl
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '4rem',
                alignItems: 'center',
                mt: 1,
              }}
            >
              <FormLabel>Active:</FormLabel>
              <SwitchButton
                checked={activeStatus}
                onChange={() =>
                  setActiveStatus((prevState: boolean) => !prevState)
                }
              />
            </FormControl>
            <FormControl
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '4rem',
                alignItems: 'center',
                mt: 1,
              }}
            >
              <FormLabel id="topic-content">Сontent</FormLabel>
              <RadioGroup
                row
                aria-labelledby="topic-content"
                name="topic-content"
                value={content}
                onChange={contentChangeHandler}
              >
                <FormControlLabel
                  value={TopicContent.Posts}
                  control={<Radio />}
                  label="List of posts"
                />
                <FormControlLabel
                  value={TopicContent.Page}
                  control={<Radio />}
                  label="Single page"
                />
              </RadioGroup>
            </FormControl>
            {content === TopicContent.Page && (
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={pageChangeHandler}
                onOpen={() => {
                  setOpenPage(true);
                }}
                onClose={() => {
                  setOpenPage(false);
                }}
                id="topic-page"
                options={pageData?.pages ?? []}
                getOptionLabel={(option: Page) =>
                  option.title
                }
                value={page}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Page"
                    placeholder="Select page"
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
            )}
          </Grid>
          <Grid item>
            <ImageUpload onImage={setImage} value={image} />
          </Grid>
        </Grid>
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Button type="submit" variant="contained">
            {edit ? 'Update' : 'Create'}
          </Button>
        </Grid>
      </Box>
    </Paper>
  );
}
