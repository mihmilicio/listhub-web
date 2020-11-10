import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import AppContext from 'store/context';

const freeRoutes = ['/login', '/register'];

export const useAuthCheck = isAuthCallback => {
  const [isAuth, setIsAuth] = useState(false);
  const appStore = useContext(AppContext);

  const router = useRouter();

  useEffect(() => {
    const isFree = freeRoutes.includes(router.pathname);
    if (!isFree && !!appStore?.state) {
      if (appStore.state.userId === null) {
        setIsAuth(false);
        router.push('/login');
      } else {
        isAuthCallback && isAuthCallback();
        setIsAuth(true);
      }
    } else if (isFree) {
      setIsAuth(true);
    }
  }, [router.pathname, appStore?.state.userId]);

  return {
    router,
    isAuth
  };
};
