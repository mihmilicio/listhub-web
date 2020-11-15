import ItemForm from 'containers/ItemForm';
import React, { useEffect, useState } from 'react';
import { withAppStore } from 'store';

const NewItem = props => {
  const [initialValues, setInitialValues] = useState({
    name: '',
    completed: false,
    position: 1,
    attributes: []
  });

  useEffect(() => {
    if (props.appStore?.state?.currentList.attributeDefinitions) {
      const newValues = { ...initialValues };
      props.appStore?.state?.currentList.attributeDefinitions.forEach(
        (attrDef, index) => {
          newValues.attributes.push({
            AttributeDefinition_id: attrDef.id,
            value: '',
            op: 'C',
            title: attrDef.title,
            type: attrDef.type,
            position: attrDef.position
          });
        }
      );
      setInitialValues(newValues);
    }
  }, [props.appStore?.state?.currentList]);

  return (
    <ItemForm
      op="C"
      currentList={props.appStore.state.currentList}
      initialValues={initialValues}
    />
  );
};

export default withAppStore(NewItem);
