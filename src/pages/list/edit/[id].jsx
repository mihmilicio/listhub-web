import React from 'react';
import { withAppStore } from 'store';
import { useRouter } from 'next/router';

//TODO: verificar se a lista pertence ao usuário antes de mostrar
const ListEdit = props => {
  const router = useRouter();
  const { id } = router.query;

  return <h1>list edit: {id}</h1>;
};

export default withAppStore(ListEdit);
