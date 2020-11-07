import React, { useEffect } from 'react';
import Head from 'next/head';
import 'styles/globals.css';
import AppStore from 'store';
import AuthBoundary from 'components/AuthBoundary';

function MyApp({ Component, pageProps }) {
  return (
    <AppStore>
      <Head>
        <title>Listhub</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AuthBoundary>
        <Component {...pageProps} />
      </AuthBoundary>
    </AppStore>
  );
}

export default MyApp;
