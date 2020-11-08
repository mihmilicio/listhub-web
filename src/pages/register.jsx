import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { withAppStore } from 'store';
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
import { Alert } from '@material-ui/lab';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Link from 'next/link';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { formatISO, parse } from 'date-fns';
import { userCreate } from 'services';

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

const Register = props => {
  const [formValues, setFormValues] = useState({
    name: '',
    username: '',
    email: '',
    birthday: null,
    password: ''
  });
  const [success, setSuccess] = useState(false);
  const classes = useStyles();
  const router = useRouter();

  const handleChange = (e, key) => {
    setFormValues(prevFormValues => ({
      ...prevFormValues,
      [key || e.target.name]: e?.target?.value || e
    }));
  };

  const onSubmit = async e => {
    const formData = new FormData(e.target);
    const formDataObj = {};
    formData.forEach((value, key) => (formDataObj[key] = value));
    formDataObj.birthday = formatISO(
      parse(formDataObj.birthday, 'dd/MM/yyyy', new Date()),
      { representation: 'date' }
    );
    console.log(formDataObj);
    await userCreate(formDataObj)
      .then(res => {
        console.log(res);
        const data = res.data;
        data.userId = data.id;
        delete data.id;
        setSuccess(true);
        setTimeout(() => {
          props.appStore.actions.setUser(res.data, () => router.push('/lists'));
        }, 5000);
      })
      .catch(err => {
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
            Cadastro
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
              label="Nome"
              name="name"
              id="name"
              type="text"
              variant="filled"
              fullWidth
              validators={['required', 'maxStringLength:100']}
              errorMessages={['Insira um nome', 'Máximo 100 caracteres']}
              value={formValues.name}
              onChange={handleChange}
            />
          </Box>
          <Box mb={2}>
            <TextValidator
              label="E-mail"
              name="email"
              id="email"
              type="email"
              variant="filled"
              fullWidth
              validators={['required', 'isEmail', 'maxStringLength:150']}
              errorMessages={[
                'Insira um e-mail',
                'E-mail inválido',
                'Máximo 150 caracteres'
              ]}
              value={formValues.email}
              onChange={handleChange}
            />
          </Box>
          <Box mb={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                id="birthday"
                name="birthday"
                inputVariant="filled"
                fullWidth
                openTo="year"
                label="Data de nascimento"
                format="dd/MM/yyyy"
                invalidDateMessage="Formato de data inválido"
                value={formValues.birthday}
                onChange={e => handleChange(e, 'birthday')}
                KeyboardButtonProps={{
                  'aria-label': 'Alterar data de nascimento'
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Box mb={2}>
            <TextValidator
              label="Username"
              name="username"
              id="username"
              type="text"
              variant="filled"
              fullWidth
              validators={['required', 'maxStringLength:45']}
              errorMessages={['Insira um username', 'Máximo 45 caracteres']}
              value={formValues.username}
              onChange={handleChange}
            />
          </Box>
          <Box mb={2}>
            <TextValidator
              label="Senha"
              name="password"
              id="password"
              type="password"
              variant="filled"
              fullWidth
              validators={['required']}
              errorMessages={['Insira uma senha']}
              value={formValues.password}
              onChange={handleChange}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Link href="/login">
              <MuiLink style={{ cursor: 'pointer' }}>Voltar ao login</MuiLink>
            </Link>
            <Button type="submit" variant="contained" color="primary">
              Cadastrar
            </Button>
          </Box>
        </ValidatorForm>
      </main>
      <Snackbar open={success} autoHideDuration={6000}>
        <Alert severity="success" elevation={6} variant="filled">
          Usuário criado com sucesso! Você será redirecionado...
        </Alert>
      </Snackbar>
    </>
  );
};

export default withAppStore(Register);
