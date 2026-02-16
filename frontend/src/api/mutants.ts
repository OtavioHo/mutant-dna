import { useApiCall } from "./client";

export const useCheckMutant = () => {
  const { execute, reset, loading, error, data, code } = useApiCall();

  const executeRequest = (dna: string[]) =>
    execute("/mutants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dna }),
    });

  return { execute: executeRequest, reset, loading, error, data, code };
};

export interface MutantRequest {
  dna: string[];
}
