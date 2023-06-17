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
  CircularProgress
} from '@mui/material';

interface EditCategoryProps {
  name?: string;
  slug?: string;
  parentCategory: { name: string, id: number } | null;
  nameChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  slugChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  parentCategoryChangeHandler: (event: FormEvent, value: any) => void;
  categorySubmitHandler: (event: FormEvent) => void;
  successMessage?: string | null;
  errorMessage?: string | null;
  buttonText?: string;
  edit?: boolean;
}

export default function EditCategory({
  name,
  slug,
  parentCategory,
  nameChangeHandler,
  slugChangeHandler,
  categorySubmitHandler,
  parentCategoryChangeHandler,
  errorMessage,
  successMessage,
  edit,
}: EditCategoryProps) {
  const [openParentCategory, setOpenParentCategory] = useState<boolean>(false);

  const { data: categoryData, isLoading: isParentCategoryLoading, mutate } = useGetData('categories', {
    revalidateOnMount: false
  });

  useEffect(() => {
    openParentCategory && mutate()
  }, [openParentCategory, mutate])

  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 5, textAlign: 'center', padding: 2 }}
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
            <Autocomplete
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={parentCategoryChangeHandler}
              onOpen={() => {
                setOpenParentCategory(true);
              }}
              onClose={() => {
                setOpenParentCategory(false);
              }}
              id="tags-standard"
              options={categoryData?.categories ?? []}
              getOptionLabel={(option: { name: string }) => option.name}
              value={parentCategory}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Parent Category"
                  placeholder="Select topics"
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
          </Grid>
        </Grid>
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Button type="submit">{edit ? 'Update' : 'Create'}</Button>
        </Grid>
      </Box>
    </Paper>
  );
}
