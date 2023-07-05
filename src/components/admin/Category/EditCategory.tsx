import { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import { useGetData } from '@/hooks/data-hook';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Alert,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import type { Category } from '@/types/content-types';
import type { EditCategory } from '@/types/props-types';
export default function EditCategory({
  id,
  name,
  slug,
  parentCategory,
  childrenCategory,
  nameChangeHandler,
  slugChangeHandler,
  categorySubmitHandler,
  parentCategoryChangeHandler,
  errorMessage,
  successMessage,
  edit,
}: EditCategory) {
  const [openParentCategory, setOpenParentCategory] = useState<boolean>(false);

  const {
    data: categoryData,
    isLoading: isParentCategoryLoading,
    mutate,
  } = useGetData<{ categories: Category[] }>('categories?parentId=null', {
    revalidateOnMount: false,
  });

  useEffect(() => {
    openParentCategory && mutate();
  }, [openParentCategory, mutate]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 2, textAlign: 'center', padding: 2 }}
      >
        {edit ? 'Edit Category' : 'New Category'}
      </Typography>
      <Box component="form" onSubmit={categorySubmitHandler}>
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
              label="Name"
              variant="standard"
              onChange={nameChangeHandler}
              value={name}
            />

            <TextField
              id="standard-basic"
              label="Slug"
              variant="standard"
              onChange={slugChangeHandler}
              value={slug}
            />
            {childrenCategory && childrenCategory.length > 0 ? (
              <Alert severity="info">
                This category contains child categories, so it is not possible
                to add a parent category
              </Alert>
            ) : (
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={parentCategoryChangeHandler}
                onOpen={() => {
                  setOpenParentCategory(true);
                }}
                onClose={() => {
                  setOpenParentCategory(false);
                }}
                id="category-parant-category"
                options={
                  id
                    ? categoryData?.categories.filter(
                        (category) => category.id !== +id
                      ) || []
                    : categoryData?.categories || []
                }
                getOptionLabel={(option: Category) => option.name}
                value={parentCategory}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Parent Category"
                    placeholder="Select category"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isParentCategoryLoading ? (
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
