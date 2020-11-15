import React from 'react';
import { withAppStore } from 'store';
import { useRouter } from 'next/router';

//TODO: verificar se a lista pertence ao usuário antes de mostrar
const ItemView = props => {
  const router = useRouter();
  const { id } = router.query;

  return <h1>item: {id}</h1>;
};

export default withAppStore(ItemView);
