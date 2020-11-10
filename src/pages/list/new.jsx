import {
  AppBar,
  Box,
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { withAppStore } from 'store';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { listCreate } from 'services';
import ColorPicker from 'material-ui-color-picker';

const useStyles = makeStyles(theme => ({
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',

    '& > form': {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  },
  backButton: {
    marginRight: theme.spacing(2)
  }
}));

const NewList = props => {
  const classes = useStyles();
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    color: '',
    attributes: []
  });
  const [formStatus, setFormStatus] = useState(null);
  const [formFeedback, setFormFeedback] = useState('');

  const handleChange = (e, key) => {
    setFormValues(prevFormValues => ({
      ...prevFormValues,
      [key || e.target.name]: e?.target?.value || e
    }));
  };

  const onSubmit = async e => {
    const formData = new FormData(e.target);
    const formDataObj = {};
    formData.forEach((value, key) => (formDataObj[key] = value || null));
    formDataObj['User_id'] = props.appStore.state.userId;
    formDataObj.color = formDataObj.color?.substring(1) || null;
    console.log(formDataObj);
    // await listCreate(formDataObj)
    //   .then(res => {
    //     console.log(res);
    //     const data = res.data;
    //     data.userId = data.id;
    //     delete data.id;
    //     setSuccess(true);
    //     setTimeout(() => {
    //       props.appStore.actions.setUser(res.data, () => router.push('/lists'));
    //     }, 5000);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     console.log(err.response);
    //     alert(err);
    //   });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.backButton}
            color="inherit"
            aria-label="Voltar"
            onClick={() => router.push('/lists')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="h1">
            Nova lista
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        <ValidatorForm
          onSubmit={onSubmit}
          onError={errors => console.log(errors)}
          autoComplete="off"
          noValidate
        >
          <Box mb={2}>
            <TextValidator
              label="Nome da lista"
              name="name"
              id="name"
              type="text"
              variant="filled"
              required
              fullWidth
              validators={['required', 'maxStringLength:255']}
              errorMessages={['Insira um nome', 'Máximo 255 caracteres']}
              value={formValues.name}
              onChange={handleChange}
            />
          </Box>
          <Box mb={2}>
            <TextValidator
              label="Descrição"
              name="description"
              id="description"
              type="text"
              variant="filled"
              fullWidth
              multiline
              value={formValues.description}
              onChange={handleChange}
            />
          </Box>
          <Box mb={2}>
            <ColorPicker
              label="Cor"
              name="color"
              id="color"
              variant="filled"
              fullWidth
              TextFieldProps={{ value: formValues.color }}
              InputProps={{
                readOnly: true,
                style: { color: formValues.color || 'inherit' }
              }}
              value={formValues.color}
              onChange={color => handleChange(color, 'color')}
            />
            {/* TODO: remove readOnly and validate hex color */}
          </Box>
          <Box ml="auto">
            <Button type="submit" variant="contained" color="primary">
              Criar lista
            </Button>
          </Box>
        </ValidatorForm>
      </main>
    </>
  );
};

export default withAppStore(NewList);
