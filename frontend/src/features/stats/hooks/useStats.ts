import { useEffect } from "react";
import { useFetchStats } from "../../../api/stats";

export const useStats = (autoFetch: boolean = true) => {
  const { fetchStats, loading, error, data } = useFetchStats();

  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch]);

  const refetch = () => {
    fetchStats();
  };

  return {
    stats: data,
    loading,
    error,
    refetch,
  };
};
