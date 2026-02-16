/**
 * Validates if a DNA sequence is valid
 * @param dna - Array of DNA strings
 * @returns true if valid, false otherwise
 */
export const isValidDnaSequence = (dna: string[]): boolean => {
  if (dna.length === 0) return false;

  return dna.every(
    (line) => /^[AGCT]+$/.test(line) && line.length === dna.length,
  );
};

/**
 * Parses input string into DNA sequence array
 * @param input - Raw input string
 * @returns Array of DNA strings
 */
export const parseDnaInput = (input: string): string[] => {
  return input
    .split(/[,]|\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => line.trim());
};

/**
 * Filters input to only allow valid DNA characters
 * @param input - Raw input string
 * @returns Filtered string with only A, G, C, T, commas, and newlines
 */
export const filterDnaInput = (input: string): string => {
  return input.replace(/[^AGCT,\n]/gi, "").toUpperCase();
};
