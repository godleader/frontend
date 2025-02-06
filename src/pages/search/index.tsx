import React from 'react';
import { useTitle } from '@refinedev/core';
import { SearchComponent } from '../../components/search';

export const SearchPage = () => {

  useTitle();

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Search Page</h1>
      <SearchComponent />
    </div>
  );
};

