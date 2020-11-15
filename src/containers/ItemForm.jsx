import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  FormControlLabel,
  Checkbox,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  TextField,
  Snackbar
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { itemCreate, itemUpdate } from 'services';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { Alert } from '@material-ui/lab';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  },
  barTitle: {
    flexGrow: 1
  }
}));

const ItemForm = ({ initialValues, op, currentList }) => {
  const classes = useStyles();
  const router = useRouter();

  const [formValues, setFormValues] = useState(initialValues);
  const [formStatus, setFormStatus] = useState(null);
  const [formFeedback, setFormFeedback] = useState('');

  useEffect(() => {
    setFormValues(Object.assign({}, initialValues));
  }, [initialValues]);

  const handleChange = (e, key) => {
    setFormValues(prevFormValues => ({
      ...prevFormValues,
      [key || e.target.name]:
        e?.target?.value != undefined ? e?.target?.value : e
    }));
  };

  const handleAttrChange = (e, index) => {
    setFormValues(prevFormValues => {
      const newValues = { ...prevFormValues };
      if (newValues.attributes[index]) {
        newValues.attributes[index].value = e.target.value;
      }

      return newValues;
    });
  };

  const onSubmit = async e => {
    setFormStatus('info');
    setFormFeedback('Enviando...');
    const formDataObj = Object.assign({}, formValues);
    Object.keys(formDataObj).forEach(key => {
      if (typeof formDataObj[key] === 'string' && !formDataObj[key]) {
        formDataObj[key] = null;
      }
    });
    formDataObj['Checklist_id'] = currentList.id;

    console.log(formDataObj);
    if (op === 'C') {
      await itemCreate(formDataObj)
        .then(res => {
          const data = res.data;
          setFormStatus('success');
          setFormFeedback(
            'Item criado com sucesso! Você será redirecionado...'
          );
          setTimeout(() => {
            router.push(`/list/${currentList.id}`);
          }, 3000);
        })
        .catch(err => {
          console.log(err);
          console.log(err.response);
          setFormStatus('error');
          setFormFeedback('Ops... Ocorreu um erro ao criar seu item...');
        });
    } else if (op === 'U') {
      await itemUpdate(formDataObj)
        .then(res => {
          const data = res.data;
          setFormStatus('success');
          setFormFeedback(
            'Item atualizado com sucesso! Você será redirecionado...'
          );
          setTimeout(() => {
            router.push(`/list/${currentList.id}`);
          }, 3000);
        })
        .catch(err => {
          console.log(err);
          console.log(err.response);
          setFormStatus('error');
          setFormFeedback('Ops... Ocorreu um erro ao atualizar seu item...');
        });
    }
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
            onClick={() => router.push(`/list/${currentList.id}`)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="h1" className={classes.barTitle}>
            {op === 'U' ? 'Editar item' : 'Novo item'}
          </Typography>
          {op === 'U' && (
            <IconButton
              aria-label="deletar item"
              color="inherit"
              onClick={() => {}}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        {op === 'U' && (
          <Box mb={1}>
            <Typography variant="subtitle2">
              Criado em:{' '}
              {format(parseISO(initialValues.creationDate), 'ccc, d LLLL y', {
                locale: ptBR
              })}
            </Typography>
          </Box>
        )}
        <ValidatorForm
          onSubmit={onSubmit}
          onError={errors => console.log(errors)}
          autoComplete="off"
          noValidate
        >
          <Box mb={2}>
            <TextValidator
              label="Título"
              name="name"
              id="name"
              type="text"
              variant="filled"
              required
              fullWidth
              validators={['required', 'maxStringLength:255']}
              errorMessages={['Insira um título', 'Máximo 255 caracteres']}
              value={formValues.name}
              onChange={handleChange}
            />
          </Box>

          <Box mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.completed}
                  onChange={handleChange}
                  name="completed"
                />
              }
              label="Completado"
            />
          </Box>

          {!!initialValues.attributes &&
            initialValues.attributes.map((attr, index) => {
              switch (attr.type) {
                case 1: //text
                  return (
                    <Box mb={2} key={index}>
                      <TextField
                        label={attr.title}
                        name={`attribute-${index}`}
                        id={`attribute-${index}`}
                        type="text"
                        variant="filled"
                        fullWidth
                        value={formValues.attributes[index]?.value || ''}
                        onChange={e => handleAttrChange(e, index)}
                      />
                    </Box>
                  );
                case 2: //number
                  return (
                    <Box mb={2} key={index}>
                      <TextField
                        label={attr.title}
                        name={`attribute-${index}`}
                        id={`attribute-${index}`}
                        type="number"
                        variant="filled"
                        fullWidth
                        value={formValues.attributes[index]?.value || ''}
                        onChange={e => handleAttrChange(e, index)}
                      />
                    </Box>
                  );
                case 3:
                  <Box mb={2} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formValues.attributes[index]?.value}
                          onChange={e => handleAttrChange(e, index)}
                          name={`attribute-${index}`}
                        />
                      }
                      label={attr.title}
                    />
                  </Box>;
                case 4:
                  return <p key={index}>date</p>;
                case 5:
                  return <p key={index}>datetime</p>;
              }
            })}

          <Box ml="auto">
            <Button type="submit" variant="contained" color="primary">
              {op === 'U' ? 'Salvar item' : 'Criar item'}
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

export default ItemForm;
