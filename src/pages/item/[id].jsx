import ItemForm from 'containers/ItemForm';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { itemGetOne } from 'services';
import { withAppStore } from 'store';

const ItemView = props => {
  const router = useRouter();
  const { id } = router.query;

  const [initialValues, setInitialValues] = useState(null);

  const addMissingDefs = data => {
    const attrDefs = props.appStore.state.currentList.attributeDefinitions;
    const attrs = data.attributes;
    const newData = { ...data };

    attrDefs.forEach(attrDef => {
      if (
        attrs.findIndex(attr => attr.attributeDefinition_id == attrDef.id) < 0
      ) {
        newData.attributes.push({
          Item_id: parseInt(id),
          AttributeDefinition_id: attrDef.id,
          value: '',
          op: 'C',
          title: attrDef.title,
          type: attrDef.type,
          position: attrDef.position
        });
      }
    });

    return newData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await itemGetOne(id)
        .then(res => {
          const data = res.data;
          data.attributes.forEach(attr => {
            attr.op = 'U';
          });
          const newData = addMissingDefs(data);
          console.log(newData);
          setInitialValues(newData);
        })
        .catch(err => {
          console.log(err);
          console.log(err.response);
          alert('Ocorreu um erro... Tente mais tarde...');
          router.push(`/list/${props.appStore.state.currentList.id}`);
        });
    };
    if (id && props.appStore?.state?.currentList) {
      fetchData();
    }
  }, [props.appStore?.state?.currentList, id]);

  if (initialValues == null) {
    return null;
  }

  return (
    <ItemForm
      op="U"
      currentList={props.appStore.state.currentList}
      initialValues={initialValues}
    />
  );
};

export default withAppStore(ItemView);
