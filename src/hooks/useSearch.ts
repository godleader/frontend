import { useState } from "react";

/**
 * A custom hook to perform HTTP searches.
 *
 * @template T - The type of the search results (default is any).
 * @returns An object containing:
 *  - search: A function to perform the search.
 *  - results: The array of results.
 *  - loading: A boolean indicating if the request is in progress.
 *  - error: An error object if the request failed.
 */
export const useSearch = <T = any>() => {
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Performs a search using the Fetch API.
   *
   * @param url - The endpoint URL to query.
   * @param options - Optional fetch options.
   */
  const search = async (url: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (err: any) {

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { search, results, loading, error };
};
