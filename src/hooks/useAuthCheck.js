import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import AppContext from 'store/context';

const freeRoutes = ['/login'];

export const useAuthCheck = isAuthCallback => {
  const [isAuth, setIsAuth] = useState(false);
  const appStore = useContext(AppContext);

  const router = useRouter();

  useEffect(() => {
    if (!freeRoutes.includes(router.pathname) && !!appStore?.state) {
      if (appStore.state.userId === null) {
        setIsAuth(false);
        router.push('/login');
      } else {
        isAuthCallback && isAuthCallback();
        setIsAuth(true);
      }
    }
  }, [router.pathname, appStore?.state.userId]);

  return {
    router,
    isAuth,
  };
};
