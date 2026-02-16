import { useApiCall } from "./client";
import type { StatsResponse } from "../types";

export const useFetchStats = () => {
  const { execute, loading, error, data } = useApiCall<StatsResponse>();

  const fetchStats = () => execute("/stats");

  return { fetchStats, loading, error, data };
};
