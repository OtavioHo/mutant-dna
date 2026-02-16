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
      />
      <DnaMatrix dna={dna} />
      {valid ? <p>Valid DNA sequence</p> : <p>Invalid DNA sequence</p>}
      <button
        disabled={!valid || loadingCheckMutant}
        onClick={() => {
          checkMutant(dna);
        }}
      >
        Is mutant?
      </button>

      {loadingCheckMutant && <p>Checking...</p>}
      {errorCheckMutant && codeCheckMutant !== 403 && (
        <p>Error: {errorCheckMutant.message}</p>
      )}
      {codeCheckMutant !== null &&
        (codeCheckMutant === 200 ? (
          <p>Result: Mutant</p>
        ) : (
          <p>Result: Human</p>
        ))}
    </>
  );
}

export default App;
