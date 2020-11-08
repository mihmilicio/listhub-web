import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  TextField,
  Box,
  Button
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { userGetOne } from 'services';
import { withAppStore } from 'store';

const useStyles = makeStyles(theme => ({
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

    '& > form': {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }
}));

const Login = props => {
  const classes = useStyles();
  const router = useRouter();

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = {};
    formData.forEach((value, key) => (formDataObj[key] = value));
    //TODO: adicionar loading
    await userGetOne(formDataObj.userId)
      .then(res => {
        console.log(res);
        props.appStore.actions.setUser(res.data, () => router.push('/lists'));
      })
      .catch(err => {
        // TODO: inline feedback no form
        console.log(err);
        alert(err);
      });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1">
            Login
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        <form noValidate autoComplete="off" onSubmit={onSubmit}>
          <Box mb={2}>
            <TextField
              label="Username"
              name="username"
              id="username"
              type="text"
              variant="filled"
              fullWidth
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="UserID"
              name="userId"
              id="userId"
              type="number"
              variant="filled"
              fullWidth
            />
          </Box>
          <Box ml="auto">
            <Button type="submit" variant="contained" color="primary">
              Entrar
            </Button>
          </Box>
        </form>
      </main>
    </>
  );
};

export default withAppStore(Login);
