import type { ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const SearchPage = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q') as string;
  const sessionIdQuery = new URLSearchParams(location.search).get('id') as string;
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryKey, setQueryKey] = useState<string>('');

  const fetchData = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?id=${id}`);
      const result = await response.json();
      setData(result);
      setQueryKey(id);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionIdQuery) {
      fetchData(sessionIdQuery);
    }
  }, [sessionIdQuery]);

  useEffect(() => {
    if (query && !sessionIdQuery) {
      fetchData(query);
    }
  }, [query, sessionIdQuery]);

  const chunk = data?.chunks?.[0] || null;
  const content = chunk?.response || '';

  const searchedQuery = data?.chunks?.[0]?.prompt || query;

  return (
    <div>
      {(!!content || !!data) && (
        <div className="flex flex-col justify-center">
          <div>
            {/* Render search results here */}
            <div>{content}</div>
          </div>
          <button
            className="order-4 mx-auto mt-5 laptop:ml-0"
            onClick={() => {
              console.log('Switching search provider');
            }}
          >
            <span>Search posts on daily.dev instead</span>
          </button>
        </div>
      )}
    </div>
  );
};

