import React, { useEffect, useState } from 'react';
import { withAppStore } from 'store';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Checkbox,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import { itemGetAll, itemUpdate, listGetOne } from 'services';
import ListItemLink from 'components/ListItemLink';
import Link from 'next/link';

const useStyles = makeStyles(theme => ({
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  backButton: {
    marginRight: theme.spacing(2)
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

//TODO: verificar se a lista pertence ao usuário antes de mostrar
const ListView = props => {
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;

  const [list, setList] = useState(null);
  const [items, setItems] = useState(null);

  const [currentEdition, setCurrentEdition] = useState(null);
  const [editionStatus, setEditionStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await listGetOne(id)
        .then(res => {
          setList(res.data);
          props.appStore.actions.setList(res.data);
        })
        .catch(err => {
          if (err.response?.status === 404) {
            alert('Essa lista não existe... Vamos te redirecionar...');
            router.push('/lists');
          } else {
            console.log(err);
            setList({ id });
            props.appStore.actions.setList({ id });
            alert('Ocorreu um erro e não conseguimos encontrar sua lista :(');
          }
        });

      await itemGetAll(id)
        .then(res => {
          setItems(res.data);
        })
        .catch(err => {
          if (err.response?.status === 404) {
            setItems([]);
          } else {
            console.log(err);
            setItems([]);
            alert(
              'Ocorreu um erro e não conseguimos encontrar os itens da sua lista :('
            );
          }
        });
    };

    if (id) {
      fetchData();
    }

    return () => {
      props.appStore.actions.setList({
        id: null,
        name: null
      });
    };
  }, [id]);

  useEffect(() => {
    if (currentEdition != null) {
      if (editionStatus === true) {
        const newItems = [...items];
        newItems[currentEdition].loading = false;
        setCurrentEdition(null);
        setItems(newItems);
      } else if (editionStatus === false) {
        const newItems = [...items];
        newItems[currentEdition].completed = !newItems[currentEdition]
          .completed;
        newItems[currentEdition].loading = false;
        setCurrentEdition(null);
        setItems(newItems);
      }
    }
  }, [items]);

  const handleToggle = async index => {
    const newItems = [...items];
    newItems[index].completed = !newItems[index].completed;

    const toSubmit = { ...items[index] };
    newItems[index].loading = true;

    setCurrentEdition(index);
    await itemUpdate(toSubmit)
      .then(res => {
        setEditionStatus(true);
      })
      .catch(err => {
        alert('Não foi possível atualizar o item...');
        setEditionStatus(false);
      });

    setItems(newItems);
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
            {list?.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        {items?.length > 0 && (
          <List style={{ background: 'white' }}>
            {items.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={item.completed}
                        disableRipple
                        inputProps={{
                          'aria-labelledby': `item-title-${item.id}`
                        }}
                        onChange={() => handleToggle(index)}
                        indeterminate={!!item.loading}
                        disabled={!!item.loading}
                      />
                    </ListItemIcon>
                    <Link href={`/item/${item.id}`}>
                      <ListItemText
                        id={`item-title-${item.id}`}
                        primary={item.name}
                        component="a"
                      />
                    </Link>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        )}
        {items != null && items.length === 0 && (
          <Box p={2}>
            <Typography>
              Nenhum item ainda... Comece criando um novo!
            </Typography>
          </Box>
        )}

        <Link href="/item/new">
          <Fab
            component="a"
            color="secondary"
            aria-label="adicionar item na lista"
            className={classes.fab}
          >
            <AddIcon />
          </Fab>
        </Link>
      </main>
    </>
  );
};

export default withAppStore(ListView);
