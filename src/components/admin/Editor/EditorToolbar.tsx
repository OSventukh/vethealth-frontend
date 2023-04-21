import {
  Paper,
  Button,
  Collapse,
  Box,
  TextField,
  Autocomplete,
} from '@mui/material';
import {
  useState,
  ChangeEvent,
  SyntheticEvent,
} from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { EditorToolbarProps } from '@/types/editor-types';

const topics = [
  {
    id: 1,
    title: 'Собаки',
  },
  {
    id: 2,
    title: 'Коти',
  },
  {
    id: 3,
    title: 'Фармакологічний довідник',
  },
];

const categories = [
  {
    id: 1,
    title: 'Лікування',
  },
  {
    id: 2,
    title: 'Догляд',
  },
  {
    id: 3,
    title: 'Інфекційні хвороби',
  },
];

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

  const changeTopicsHandler = (
    event: SyntheticEvent,
    value: { id: number }[]
  ) => {
    const topicsIds = value.map((item) => item.id);
    onTopics(topicsIds);
  };

  const changeCategoriesHandler = (
    event: SyntheticEvent,
    value: { id: number }[]
  ) => {
    const categoriesIds = value.map((item) => item.id);
    onCategories(categoriesIds);
  };

  const slugChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      onSlug(event.target.value);
    }
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
        <Autocomplete
          onChange={changeTopicsHandler}
          multiple
          id="tags-standard"
          options={topics}
          getOptionLabel={(option) => option?.title}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Topic"
              placeholder="Select topics"
            />
          )}
        />
        <Autocomplete
          multiple
          id="tags-standard"
          onChange={changeCategoriesHandler}
          options={categories}
          getOptionLabel={(option) => option?.title}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Category"
              placeholder="Select categories"
            />
          )}
        />
        <TextField
          id="standard-basic"
          label="Slug"
          variant="standard"
          onChange={slugChangeHandler}
        />
      </Collapse>
    </Paper>
  );
}
