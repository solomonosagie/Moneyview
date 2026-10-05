export interface FetchState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | undefined;
  refetch: () => void;
}

export function useFetch<T>(fetcher: () => Promise<T>): FetchState<T>;
