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

import { EditorToolbarProps } from '@/types/editor-types';

export default function EditorToolbar({
  onSave,
  onSaveDraft,
  onTopics,
  onCategories,
  onSlug,
  initTopics,
  initCategories,
  initSlug,
}: EditorToolbarProps) {
  const [openOption, setOpenOption] = useState(false);
  const [openTopic, setOpenTopic] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const {
    data: topicData,
    isLoading: isTopicLoading,
    mutate: mutateTopic,
  } = useGetData('topics', {
    revalidateOnMount: false,
    revalidation: false,
  });

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    mutate: mutateCategory,
  } = useGetData('categories', {
    revalidateOnMount: false,
    revalidation: false,
  });

  useEffect(() => {
    openTopic && mutateTopic();
    openCategory && mutateCategory();
  }, [openTopic, mutateTopic, openCategory, mutateCategory]);

  const changeTopicsHandler = (event: SyntheticEvent, value: any) => {
    onTopics(value);
  };

  const changeCategoriesHandler = (event: SyntheticEvent, value: any) => {
    onCategories(value);
  };

  const slugChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onSlug(event.target.value.trim());
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
            id="tags-standard"
            options={topicData?.topics ?? []}
            getOptionLabel={(option: { title: string, id: number }) => option.title}
            defaultValue={[]}
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
          <Autocomplete
            isOptionEqualToValue={(option, value) => option.id === value.id}
            multiple
            onOpen={() => {
              setOpenCategory(true);
            }}
            onClose={() => {
              setOpenCategory(false);
            }}
            id="tags-standard"
            onChange={changeCategoriesHandler}
            options={categoryData?.categories ?? []}
            getOptionLabel={(option: { name: string, id: number }) => option.name}
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
