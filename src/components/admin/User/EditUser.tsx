import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent, SyntheticEvent } from 'react';
import Link from 'next/link';
import { UserRole, UserStatus } from '@/utils/constants/users.enum';
import { useSession } from 'next-auth/react';

import {
  Paper,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Alert,
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';

interface EditUserProps {
  id?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  status: string;
  topics: { title: string; id: number }[] | null;
  role: { name: string; id: number } | null;
  firstnameChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  lastnameChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  emailChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  statusChangeHandler: (event: SelectChangeEvent<string>) => void;
  topicsChangeHandler: (
    event: SyntheticEvent,
    value: { title: string; id: number }[] | null
  ) => void;
  roleChangeHandler: (
    event: SyntheticEvent,
    value: { name: string; id: number } | null
  ) => void;
  userSubmit: (event: FormEvent) => void;
  successMessage: string | null;
  errorMessage: string | null;
  edit?: boolean;
}

import { useGetData } from '@/hooks/data-hook';

export default function EditUser({
  id,
  firstname,
  lastname,
  email,
  status,
  topics,
  role,
  firstnameChangeHandler,
  lastnameChangeHandler,
  emailChangeHandler,
  topicsChangeHandler,
  roleChangeHandler,
  userSubmit,
  statusChangeHandler,
  successMessage,
  errorMessage,
  edit,
}: EditUserProps) {
  const [openTopics, setOpenTopics] = useState(false);
  const [openRole, setOpenRole] = useState(false);

  const { data: session} = useSession()

  const {
    data: topicsData,
    isLoading: isTopicsLoading,
    mutate: topicMutate,
  } = useGetData('topics', { revalidateOnMount: false });

  const {
    data: rolesData,
    isLoading: isRolesLoading,
    mutate: roleMutate,
  } = useGetData('roles', { revalidateOnMount: false });

  useEffect(() => {
    openTopics && topicMutate();
    openRole && roleMutate();
  }, [openTopics, openRole, topicMutate, roleMutate]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 2, textAlign: 'center', padding: 2 }}
      >
        {edit ? 'Edit User' : 'New User'}
      </Typography>
      <Box component="form" onSubmit={userSubmit}>
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
              label="First name"
              variant="standard"
              onChange={firstnameChangeHandler}
              value={firstname}
            />

            <TextField
              id="standard-basic"
              label="Last name"
              variant="standard"
              onChange={lastnameChangeHandler}
              value={lastname}
            />

            <TextField
              id="standard-basic"
              label="Email"
              variant="standard"
              onChange={emailChangeHandler}
              value={email}
            />

            {session?.user && session.user.id.toString() !== id && edit && (
              <FormControl variant="standard">
                <InputLabel id="demo-simple-select-standard-label">
                  Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={status}
                  onChange={statusChangeHandler}
                  label="Status"
                >
                  <MenuItem value={UserStatus.Pending}>{UserStatus.Pending}</MenuItem>
                  <MenuItem value={UserStatus.Active}>{UserStatus.Active}</MenuItem>
                  <MenuItem value={UserStatus.Blocked}>
                    <span style={{ color: 'red' }}>{UserStatus.Blocked}</span>
                  </MenuItem>
                </Select>
              </FormControl>
            )}
            {session?.user && session.user.id.toString() !== id && (
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={roleChangeHandler}
                onOpen={() => {
                  setOpenRole(true);
                }}
                onClose={() => {
                  setOpenRole(false);
                }}
                id="tags-standard"
                options={rolesData?.roles ?? []}
                getOptionLabel={(option: { name: string; id: number }) =>
                  option.name
                }
                value={role}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Role"
                    placeholder="Select user role"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isRolesLoading && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
            {role?.name !== UserRole.SuperAdmin &&
              role?.name !== UserRole.Admin && (
                <Autocomplete
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  multiple
                  onChange={topicsChangeHandler}
                  onOpen={() => {
                    setOpenTopics(true);
                  }}
                  onClose={() => {
                    setOpenTopics(false);
                  }}
                  id="tags-standard"
                  options={topicsData?.topics ?? []}
                  getOptionLabel={(option: { title: string; id: number }) =>
                    option.title
                  }
                  noOptionsText={<Link style={{ color: 'inherit', textDecoration: 'none' }} href="/admin/topics/new">Create first topic</Link>}
                  value={topics ?? []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Topics that the user can access"
                      placeholder="Select topics"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isTopicsLoading && (
                              <CircularProgress color="inherit" size={20} />
                            )}
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
          <Button type="submit">{edit ? 'Update' : 'Create'}</Button>
        </Grid>
      </Box>
    </Paper>
  );
}
