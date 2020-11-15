import ListForm from 'containers/ListForm';
import React, { useEffect, useState } from 'react';
import { withAppStore } from 'store';

const NewList = props => {
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

  return <ListForm op="C" initialValues={initialValues} />;
};

export default withAppStore(NewList);
