import ListForm from 'containers/ListForm';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { withAppStore } from 'store';

const ListEdit = props => {
  const router = useRouter();
  const { id } = router.query;

  const [initialValues, setInitialValues] = useState(null);
  const initialAttr = {
    title: 'Título',
    type: 1,
    position: 1
  };

  useEffect(() => {
    if (props.appStore?.state?.currentList.id) {
      const data = { ...props.appStore.state.currentList };
      if (data.color == null) {
        data.color = '';
      } else if (data.color) {
        data.color = '#' + data.color;
      }

      if (data.description == null) data.description = '';

      data.attributes = [initialAttr, ...data.attributeDefinitions];
      data.attributes.forEach(attrDef => {
        attrDef.op = 'U';
      });
      delete data.attributeDefinitions;

      setInitialValues(data);
    }
  }, [props.appStore?.state?.currentList, id]);

  const onListUpdated = data => {
    props.appStore.actions.setList(data, () => {
      router.push(`/list/${data.id}`);
    });
  };

  if (initialValues == null) {
    return null;
  }

  return (
    <ListForm
      op="U"
      initialValues={initialValues}
      successCallback={onListUpdated}
    />
  );
};

export default withAppStore(ListEdit);
