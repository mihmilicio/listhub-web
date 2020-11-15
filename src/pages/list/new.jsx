import {
  AppBar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Snackbar,
  Toolbar,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { withAppStore } from 'store';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { listCreate } from 'services';
import ColorPicker from 'material-ui-color-picker';
import { Alert } from '@material-ui/lab';

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
    attributes: [
      {
        title: 'Título',
        type: 1,
        position: 1
      }
    ]
  });
  const [formStatus, setFormStatus] = useState(null);
  const [formFeedback, setFormFeedback] = useState('');

  const handleChange = (e, key) => {
    setFormValues(prevFormValues => ({
      ...prevFormValues,
      [key || e.target.name]: e?.target?.value || e
    }));
  };

  const handleAttrChange = (e, index, key) => {
    setFormValues(prevFormValues => {
      const newValues = { ...prevFormValues };
      if (newValues.attributes[index]) {
        newValues.attributes[index][key] = e.target.value;
      } else {
        //undefined (new index)
        newValues.attributes[index] = {
          title: '',
          type: 1,
          position: 1
        };
        newValues.attributes[index][key] = e.target.value;
      }

      return newValues;
    });
  };

  const addAttribute = () => {
    setFormValues(prev => {
      const newValues = { ...prev };
      const newIndex = newValues.attributes.length;
      newValues.attributes[newIndex] = {
        title: '',
        type: 1,
        position: 1
      };
      return newValues;
    });
  };

  const removeAttribute = index => {
    setFormValues(prev => {
      const newValues = { ...prev };
      newValues.attributes.splice(index, 1);
      return newValues;
    });
  };

  const onSubmit = async e => {
    setFormStatus('info');
    setFormFeedback('Enviando...');
    const formDataObj = Object.assign({}, formValues);
    Object.keys(formDataObj).forEach(key => {
      if (!formDataObj[key]) {
        formDataObj[key] = null;
      }
    });
    formDataObj['User_id'] = props.appStore.state.userId;
    formDataObj.color = formDataObj.color?.substring(1) || null;
    formDataObj.attributes.splice(0, 1); // strip default field
    formDataObj.attributes.forEach(attr => (attr.op = 'C'));
    formDataObj.attributeDefinitions = [...formDataObj.attributes];
    delete formDataObj.attributes;

    await listCreate(formDataObj)
      .then(res => {
        console.log(res);
        const data = res.data;
        setFormStatus('success');
        setFormFeedback('Lista criada com sucesso! Você será redirecionado...');
        setTimeout(() => {
          props.appStore.actions.setList(data, () =>
            router.push(`/list/${data.id}`)
          );
        }, 3000);
      })
      .catch(err => {
        console.log(err);
        console.log(err.response);
        setFormStatus('error');
        setFormFeedback('Ops... Ocorreu um erro...');
      });
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

          <Box mt={4} mb={2}>
            <Typography variant="h5" component="h2">
              Campos dos itens dessa lista
            </Typography>
          </Box>
          {formValues.attributes.map((attribute, index) => (
            <Box mt={index > 0 ? 2 : 0} key={index}>
              <Grid container spacing={2}>
                <Grid item xs>
                  <TextValidator
                    label="Nome do campo"
                    name={`attributes[${index}][title]`}
                    id={`attributes-${index}-title`}
                    type="text"
                    variant="filled"
                    required
                    fullWidth
                    validators={['required', 'maxStringLength:45']}
                    errorMessages={['Insira um nome', 'Máximo 45 caracteres']}
                    value={formValues.attributes[index].title}
                    onChange={e => handleAttrChange(e, index, 'title')}
                    disabled={index === 0}
                  />
                </Grid>
                <Grid item xs>
                  <FormControl
                    variant="filled"
                    fullWidth
                    className={classes.formControl}
                  >
                    <InputLabel id={`attributes-${index}-type-label`}>
                      Tipo
                    </InputLabel>
                    <Select
                      labelId={`attributes-${index}-type-label`}
                      name={`attributes[${index}][type]`}
                      id={`attributes-${index}-type`}
                      required
                      value={formValues.attributes[index].type}
                      onChange={e => handleAttrChange(e, index, 'type')}
                      disabled={index === 0}
                    >
                      <MenuItem value={1}>Texto</MenuItem>
                      <MenuItem value={2}>Número</MenuItem>
                      <MenuItem value={3}>Sim / Não</MenuItem>
                      <MenuItem value={4}>Data</MenuItem>
                      <MenuItem value={5}>Data e hora</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <IconButton
                    aria-label="Remover campo"
                    style={{ visibility: index > 0 ? 'visible' : 'hidden' }}
                    disabled={index === 0}
                    onClick={() => removeAttribute(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Box ml="auto" mb={4} mt={1}>
            <Button
              type="button"
              startIcon={<AddIcon />}
              onClick={addAttribute}
            >
              Adicionar campo
            </Button>
          </Box>

          <Box ml="auto">
            <Button type="submit" variant="contained" color="primary">
              Criar lista
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

export default withAppStore(NewList);
