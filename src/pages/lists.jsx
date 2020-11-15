import {
  AppBar,
  Divider,
  Fab,
  IconButton,
  List,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import ListItemLink from 'components/ListItemLink';
import Link from 'next/link';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { listGetAll } from 'services';
import { withAppStore } from 'store';

const useStyles = makeStyles(theme => ({
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  barTitle: {
    flexGrow: 1
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

const Lists = props => {
  const [lists, setLists] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const fetchLists = async () => {
      await listGetAll(props.appStore.state.userId)
        .then(res => {
          setLists(res.data);
        })
        .catch(err => {
          if (err.response?.status === 404) {
            setLists([]);
          } else {
            console.log(err);
            setLists([]);
            alert('Ocorreu um erro e não conseguimos buscar suas listas :(');
          }
        });
    };
    props.appStore.actions.setList({
      id: null,
      name: null,
      attributeDefinitions: []
    });
    if (props.appStore?.state?.userId) {
      fetchLists();
    }
  }, [props.appStore?.state?.userId]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1" className={classes.barTitle}>
            Minhas listas
          </Typography>
          <IconButton
            aria-label="fazer logout da aplicação"
            color="inherit"
            onClick={() => props.appStore.actions.clear()}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        {lists?.length > 0 && (
          <List style={{ background: 'white' }}>
            {lists.map((list, index) => {
              return (
                <React.Fragment key={list.id}>
                  {index > 0 && <Divider />}
                  <ListItemLink href={`/list/${list.id}`}>
                    <ListItemText
                      primary={list.name}
                      style={{
                        color: list.color ? `#${list.color}` : 'inherit'
                      }}
                    />
                  </ListItemLink>
                </React.Fragment>
              );
            })}
          </List>
        )}
        {lists != null && lists.length === 0 && (
          <Box p={2}>
            <Typography>
              Nenhuma lista ainda... Comece criando uma nova!
            </Typography>
          </Box>
        )}
        <Link href="/list/new">
          <Fab
            component="a"
            color="secondary"
            aria-label="adicionar lista"
            className={classes.fab}
          >
            <AddIcon />
          </Fab>
        </Link>
      </main>
    </>
  );
};

export default withAppStore(Lists);
