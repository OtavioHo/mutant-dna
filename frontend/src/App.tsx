import { useEffect, useState } from "react";
import "./App.css";
import DnaMatrix from "./components/DnaMatrix";
import { useCheckMutant } from "./api/mutants";

function App() {
  const [dna, setDna] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [valid, setValid] = useState<boolean | null>(false);
  const {
    execute: checkMutant,
    loading: loadingCheckMutant,
    error: errorCheckMutant,
    code: codeCheckMutant,
    reset: resetCheckMutant,
  } = useCheckMutant();

  useEffect(() => {
    setDna(inputValue.split(/[,]|\n/).filter((line) => line.trim() !== ""));
    if (codeCheckMutant !== null) {
      resetCheckMutant();
    }
  }, [inputValue]);

  useEffect(() => {
    if (dna.length === 0) {
      setValid(false);
      return;
    }
    const isValid = dna.every(
      (line) => /^[AGCT]+$/.test(line) && line.length === dna.length,
    );
    setValid(isValid);
  }, [dna]);

  return (
    <>
      <h1>DNA Mutant Detector</h1>
      <textarea
        value={inputValue}
        onChange={(e) => {
          const filtered = e.target.value.replace(/[^AGCT,\n]/gi, "");
          setInputValue(filtered.toUpperCase());
        }}
        placeholder="Enter DNA sequence"
        aria-label="DNA sequence input. Enter a comma or newline separated DNA sequence using only A, G, C, T letters"
        aria-invalid={dna.length > 0 && !valid}
      />
      <DnaMatrix dna={dna} />
      {dna.length > 0 &&
        (valid ? (
          <p className="message message-success" role="status" aria-live="polite">
            <span aria-hidden="true">✓</span>
            <span className="sr-only">Success: </span>
            Valid DNA sequence
          </p>
        ) : (
          <p className="message message-error" role="alert" aria-live="assertive">
            <span aria-hidden="true">✗</span>
            <span className="sr-only">Error: </span>
            Invalid DNA sequence
          </p>
        ))}
      <button
        disabled={!valid || loadingCheckMutant}
        onClick={() => {
          checkMutant(dna);
        }}
        aria-label={loadingCheckMutant ? "Checking DNA sequence, please wait" : "Check if DNA sequence is mutant"}
      >
        Is mutant?
      </button>

      {loadingCheckMutant && (
        <p className="message message-loading" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true"></span>
          <span>Analyzing DNA sequence...</span>
        </p>
      )}
      {errorCheckMutant && codeCheckMutant !== 403 && (
        <p className="message message-error" role="alert" aria-live="assertive">
          <span aria-hidden="true">⚠</span>
          <span className="sr-only">Error: </span>
          {errorCheckMutant.message}
        </p>
      )}
      {codeCheckMutant !== null &&
        (codeCheckMutant === 200 ? (
          <p className="message message-mutant" role="status" aria-live="polite">
            <span aria-hidden="true">🧬</span>
            <span className="sr-only">Analysis complete: </span>
            Result: Mutant Detected!
          </p>
        ) : (
          <p className="message message-human" role="status" aria-live="polite">
            <span aria-hidden="true">👤</span>
            <span className="sr-only">Analysis complete: </span>
            Result: Human DNA
          </p>
        ))}
    </>
  );
}

export default App;
