-- Migration: create mutants table
CREATE TABLE IF NOT EXISTS mutants (
  id SERIAL PRIMARY KEY,
  dna TEXT[] NOT NULL,
  dna_hash TEXT NOT NULL UNIQUE,
  is_mutant BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- index to speed up mutant lookup by is_mutant
CREATE INDEX IF NOT EXISTS idx_mutants_is_mutant ON mutants (is_mutant);
