import MutantDetector from "./mutantDetector.interface";

export default class DefaultMutantDetector implements MutantDetector {
  async isMutant(dna: string[]): Promise<boolean> {
    return Promise.resolve(this.check(dna)); // Placeholder: Implement the actual mutant detection logic here
  }

  check(dna: string[]): boolean {
    let sequencesCount = 0;
    const n = dna.length;
    const TARGET = 2;
    const SEQUENCE_SIZE = 4;

    if (n === 0) return false;
    if (dna.some((strand) => strand.length !== n)) return false;
    if (n < SEQUENCE_SIZE) return false;

    // Check horizontal
    for (let row = 0; row < n; row++) {
      let count = 1;
      for (let col = 1; col < n; col++) {
        if (dna[row][col] === dna[row][col - 1]) {
          if (++count === SEQUENCE_SIZE) {
            if (++sequencesCount >= TARGET) return true;
            count = 1;
          }
        } else count = 1;
      }
    }

    // Check vertical
    for (let col = 0; col < n; col++) {
      let count = 1;
      for (let row = 1; row < n; row++) {
        if (dna[row][col] === dna[row - 1][col]) {
          if (++count === SEQUENCE_SIZE) {
            if (++sequencesCount >= TARGET) return true;
            count = 1;
          }
        } else count = 1;
      }
    }

    // Check diagonals (top-left to bottom-right)
    for (let d = -n + 4; d < n - 3; d++) {
      let count = 1;
      for (
        let i = Math.max(0, d), j = Math.max(0, -d);
        i < n && j < n;
        i++, j++
      ) {
        if (i > 0 && dna[i][j] === dna[i - 1][j - 1]) {
          if (++count === SEQUENCE_SIZE) {
            if (++sequencesCount >= TARGET) return true;
            count = 1;
          }
        } else count = 1;
      }
    }

    // Check diagonals (top-right to bottom-left)
    for (let d = 3; d < 2 * n - 4; d++) {
      let count = 1;
      for (
        let i = Math.max(0, d - n + 1), j = Math.min(n - 1, d);
        i < n && j >= 0;
        i++, j--
      ) {
        if (i > 0 && j < n - 1 && dna[i][j] === dna[i - 1][j + 1]) {
          if (++count === SEQUENCE_SIZE) {
            if (++sequencesCount >= TARGET) return true;
            count = 1;
          }
        } else count = 1;
      }
    }

    return sequencesCount >= TARGET;
  }
}
