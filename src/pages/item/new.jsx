import ItemForm from 'containers/ItemForm';
import { defaultValues } from 'helpers/typeEnums';
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
      props.appStore.state.currentList.attributeDefinitions.forEach(
        (attrDef, index) => {
          console.log(attrDef.type);
          newValues.attributes.push({
            AttributeDefinition_id: attrDef.id,
            value: defaultValues[attrDef.type],
            op: 'C',
            title: attrDef.title,
            type: attrDef.type,
            position: attrDef.position
          });
        }
      );
      setInitialValues(newValues);
      console.log(newValues);
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
