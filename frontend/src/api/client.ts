import { useState, useCallback } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export function useApiCall<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [code, setCode] = useState<number | null>(null);

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
    setCode(null);
  };

  const execute = useCallback(
    async (url: string, options?: RequestInit): Promise<T> => {
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}${url}`, options);
        setCode(response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLoading(false);
        setData(data);
        return data;
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("An error occurred");
        setLoading(false);
        setError(err);
        throw err;
      }
    },
    [],
  );

  return { loading, error, data, code, execute, reset };
}

export { API_BASE_URL };
