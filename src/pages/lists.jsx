import { useAuthCheck } from 'hooks/useAuthCheck';
import React from 'react';
import { withAppStore } from 'store';

const Lists = props => {
  return <h1>lists</h1>;
};

export default withAppStore(Lists);
