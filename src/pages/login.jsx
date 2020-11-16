import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Box,
  Button,
  Link as MuiLink,
  Snackbar
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { userGetOne } from 'services';
import { withAppStore } from 'store';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Link from 'next/link';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '500px',
    maxWidth: '100%',
    margin: '0 auto',

    '& > form': {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }
}));

const Login = props => {
  const [formValues, setFormValues] = useState({
    username: '',
    userId: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [formFeedback, setFormFeedback] = useState('');

  const classes = useStyles();
  const router = useRouter();

  const handleChange = e => {
    setFormValues(prevFormValues => ({
      ...prevFormValues,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async e => {
    setFormStatus('info');
    setFormFeedback('Enviando...');
    const formData = new FormData(e.target);
    const formDataObj = {};
    formData.forEach((value, key) => (formDataObj[key] = value));
    //TODO: adicionar loading
    await userGetOne(formDataObj.userId)
      .then(res => {
        console.log(res);
        const data = res.data;
        data.userId = data.id;
        delete data.id;
        props.appStore.actions.setUser(res.data, () => router.push('/lists'));
      })
      .catch(err => {
        console.log(err);
        console.log(err.response);
        if (err?.response?.status === 404) {
          setFormStatus('error');
          setFormFeedback('UserID não encontrado...');
        } else {
          alert(err);
        }
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
        <ValidatorForm
          onSubmit={onSubmit}
          onError={errors => console.log(errors)}
          autoComplete="off"
        >
          <Box mb={2}>
            <TextValidator
              label="UserID"
              name="userId"
              id="userId"
              type="number"
              variant="filled"
              fullWidth
              validators={['required']}
              errorMessages={['Insira um userId']}
              value={formValues.userId}
              onChange={handleChange}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Link href="/register">
              <MuiLink style={{ cursor: 'pointer' }}>Criar conta</MuiLink>
            </Link>
            <Button type="submit" variant="contained" color="primary">
              Entrar
            </Button>
          </Box>
        </ValidatorForm>
      </main>
      <Snackbar
        open={formFeedback.length > 0}
        autoHideDuration={6000}
        onClose={() => setFormFeedback('')}
      >
        <Alert severity={formStatus} elevation={6} variant="filled">
          {formFeedback}
        </Alert>
      </Snackbar>
    </>
  );
};

export default withAppStore(Login);
