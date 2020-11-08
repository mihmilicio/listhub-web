import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Box,
  Button
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { userGetOne } from 'services';
import { withAppStore } from 'store';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

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
  const [formValues, setFormValues] = useState({
    username: '',
    userId: ''
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    ValidatorForm.addValidationRule('idExists', value => {
      if (user === null || user?.id != value) {
        return userGetOne(value)
          .then(res => {
            setUser(res.data);
            return true;
          })
          .catch(err => {
            if (err.response) {
              if (err.response.status === 404) {
                return false;
              }
            } else {
              alert('Internal error');
              return false;
            }
          });
      }
      return true;
    });

    return () => {
      ValidatorForm.removeValidationRule('idExists');
    };
  }, []);

  const classes = useStyles();
  const router = useRouter();

  const handleChange = e => {
    setFormValues(prevFormValues => ({
      ...prevFormValues,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async e => {
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
        // TODO: inline feedback no form
        console.log(err);
        console.log(err.response);
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
        <ValidatorForm
          onSubmit={onSubmit}
          onError={errors => console.log(errors)}
          autoComplete="off"
        >
          <Box mb={2}>
            <TextValidator
              label="Username"
              name="username"
              id="username"
              type="text"
              variant="filled"
              fullWidth
              validators={['required']}
              errorMessages={['Insira um username']}
              value={formValues.username}
              onChange={handleChange}
            />
          </Box>
          <Box mb={2}>
            <TextValidator
              label="UserID"
              name="userId"
              id="userId"
              type="number"
              variant="filled"
              fullWidth
              validators={['required', 'idExists']}
              errorMessages={['Insira um userId', 'UserID não encontrado']}
              value={formValues.userId}
              onChange={handleChange}
            />
          </Box>
          <Box ml="auto">
            <Button type="submit" variant="contained" color="primary">
              Entrar
            </Button>
          </Box>
        </ValidatorForm>
      </main>
    </>
  );
};

export default withAppStore(Login);
