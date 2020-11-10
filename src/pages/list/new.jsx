import React from 'react';
import { withAppStore } from 'store';

const NewList = props => {
  return <h1>new list</h1>;
};

export default withAppStore(NewList);
