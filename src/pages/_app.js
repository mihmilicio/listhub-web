import React, { useEffect } from 'react';
import Head from 'next/head';
import AppStore from 'store';
import AuthBoundary from 'components/AuthBoundary';
import { CssBaseline, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }
}));

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  const classes = useStyles();

  return (
    <AppStore>
      <Head>
        <title>Listhub</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <CssBaseline />
      <AuthBoundary>
        <div className={classes.root}>
          <Component {...pageProps} />
        </div>
      </AuthBoundary>
    </AppStore>
  );
}

export default MyApp;
