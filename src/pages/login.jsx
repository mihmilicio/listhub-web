import { useRouter } from 'next/router';
import React from 'react';
import { withAppStore } from 'store';

const Login = props => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        props.appStore.actions.setUser({ userId: 1 });
        router.push('/lists');
      }}
    >
      page
    </button>
  );
};

export default withAppStore(Login);
