import React, { useEffect } from 'react';
import { useSearch } from '../../../hooks/useSearch';
import GetData from "../queries/GetData";
export const SearchPage = () => {
  const { search, results } = useSearch();

  useEffect(() => {
    search('https://server-ecru-phi.vercel.app/search');
  }, []);

  return (
    <div>
      <h1>Search Results</h1>
      <GetData />
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
};

