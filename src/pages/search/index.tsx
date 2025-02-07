import React from 'react';
import { useTitle } from '@refinedev/core';
import { SearchComponent } from '../../components/search';
import { Typography } from 'antd';

export const SearchPage = () => {

  useTitle();

  return (
    <div>

      <SearchComponent />
    </div>
  );
};

