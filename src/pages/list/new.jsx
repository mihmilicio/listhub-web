import ListForm from 'containers/ListForm';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { withAppStore } from 'store';

const NewList = props => {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    color: '',
    attributes: [
      {
        title: 'Título',
        type: 1,
        position: 1
      }
    ]
  });

  useEffect(() => {
    if (props.appStore?.state?.userId) {
      const newValues = { ...initialValues };
      newValues['User_id'] = props.appStore.state.userId;
      setInitialValues(newValues);
    }
  }, [props.appStore?.state?.userId]);

  const onListCreated = data => {
    props.appStore.actions.setList(data, router.push(`/list/${data.id}`));
  };

  return (
    <ListForm
      op="C"
      initialValues={initialValues}
      successCallback={onListCreated}
    />
  );
};

export default withAppStore(NewList);
