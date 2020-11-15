import { ListItem } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';

const ListItemLink = ({ href, ...props }) => {
  return (
    <Link href={href}>
      <ListItem button component="a" {...props} />
    </Link>
  );
};

export default ListItemLink;
