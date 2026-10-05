import { useCallback, useEffect, useState } from 'react';

export function useFetch(fetcher) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({
    data: undefined,
    isLoading: true,
    error: undefined,
  });

  const refetch = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    let isCurrent = true;
    setState((current) => ({
      ...current,
      isLoading: true,
      error: undefined,
    }));

    fetcher()
      .then((data) => {
        if (isCurrent) {
          setState({ data, isLoading: false, error: undefined });
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setState((current) => ({
            ...current,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'The sample data could not be loaded.',
          }));
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [fetcher, attempt]);

  return { ...state, refetch };
}
