import {
  Paper,
  Button,
  Collapse,
  Box,
  TextField,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { useState, ChangeEvent, SyntheticEvent, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useGetData } from '@/hooks/data-hook';

import type { EditorToolbarProps, Category, Topic, Page } from '@/types/editor-types';

export default function EditorToolbar({
  onSave,
  onSaveDraft,
  onTopics,
  onTopic,
  onCategories,
  onSlug,
  onParentPages,
  initTopics,
  initTopic,
  initCategories,
  initSlug,
  initParentPage,
  isPage,
}: EditorToolbarProps) {
  const [openOption, setOpenOption] = useState(false);
  const [openTopic, setOpenTopic] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openParentPage, setOpenParentPage] = useState(false);

  const {
    data: topicData,
    isLoading: isTopicLoading,
    mutate: mutateTopic,
  } = useGetData('usertopics?include=pages', {
    revalidateOnMount: false,
  });

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    mutate: mutateCategory,
  } = useGetData(
    `topiccategories/?topics=${
      initTopics && initTopics.map((t) => t.id).join(',')
    }`,
    {
      revalidateOnMount: false,
    }
  );

  // const {
  //   data: pageData,
  //   isLoading: isPageLoading,
  //   mutate: mutatePage,
  // } = useGetData(
  //   `topics=${initTopics && initTopics.map((t) => t.id).join(',')}`,
  //   {
  //     revalidateOnMount: false,
  //   }
  // );

  useEffect(() => {
    openTopic && mutateTopic();
    openCategory && mutateCategory();
  }, [openTopic, mutateTopic, openCategory, mutateCategory]);

  const changeTopicsHandler = (event: SyntheticEvent, value: Topic[]) => {
    onTopics(value);
  };

  const changeTopicHandler = (event: SyntheticEvent, value: Topic | null) => {
    onTopic(value);
  }

  const changeCategoriesHandler = (event: SyntheticEvent, value: Category[]) => {
    onCategories(value);
  };

  const slugChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onSlug(event.target.value.trim());
  };

  const changeParentPageHandler = (event: SyntheticEvent, value: Page | null) => {
    onParentPages(value);
  };

  return (
    <Paper sx={{ p: '0.5rem 4rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button variant="contained" color="success" onClick={onSave}>
            Save
          </Button>
          <Button onClick={onSaveDraft}>Save Draft</Button>
        </Box>
        <Button onClick={() => setOpenOption((prevState) => !prevState)}>
          <KeyboardArrowDownIcon /> Option
        </Button>
      </Box>
      <Collapse
        in={openOption}
        timeout="auto"
        unmountOnExit
        sx={{ mt: '1rem' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {!isPage && (
            <Autocomplete
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={changeTopicsHandler}
              onOpen={() => {
                setOpenTopic(true);
              }}
              onClose={() => {
                setOpenTopic(false);
              }}
              multiple
              id="topic"
              options={topicData?.topics ?? []}
              getOptionLabel={(option: Topic) => option.title}
              value={initTopics ?? []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Topic"
                  placeholder="Select topics"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isTopicLoading ? (
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

          {!isPage && initTopics && initTopics.length > 0 && (
            <Autocomplete
              isOptionEqualToValue={(option, value) => option.id === value.id}
              multiple
              groupBy={(option) =>
                option.parent ? option.parent.name : 'Other'
              }
              onOpen={() => {
                setOpenCategory(true);
              }}
              onClose={() => {
                setOpenCategory(false);
              }}
              id="tags-standard"
              onChange={changeCategoriesHandler}
              options={
                categoryData?.categories.filter(
                  (category: Category) => category?.children?.length === 0
                ) ?? []
              }
              getOptionLabel={(option: Category) => option.name}
              defaultValue={[]}
              value={initCategories ?? []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Category"
                  placeholder="Select categories"
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
          )}

          {isPage && (
            <Autocomplete
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={changeTopicHandler}
              onOpen={() => {
                setOpenTopic(true);
              }}
              onClose={() => {
                setOpenTopic(false);
              }}
              id="topic"
              options={topicData?.topics ?? []}
              getOptionLabel={(option: Topic) => option.title}
              value={initTopic}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Topic"
                  placeholder="Select topic"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isTopicLoading ? (
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
          {isPage && (
            <Autocomplete
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={changeParentPageHandler}
              onOpen={() => {
                setOpenParentPage(true);
              }}
              onClose={() => {
                setOpenParentPage(false);
              }}
              id="parent-page"
              options={topicData?.topics?.pages || []}
              getOptionLabel={(option: Page) => option.title}
              value={initParentPage}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Parent Page"
                  placeholder="Select parent pages"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isTopicLoading ? (
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

          <TextField
            id="standard-basic"
            label="Slug"
            variant="standard"
            onChange={slugChangeHandler}
            value={initSlug}
            sx={{
              width: '100%',
            }}
          />
        </Box>
      </Collapse>
    </Paper>
  );
}
