import { useEffect, useState } from "react";
import "./App.css";
import DnaMatrix from "./components/DnaMatrix";

function App() {
  const [dna, setDna] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [valid, setValid] = useState<boolean | null>(false);

  useEffect(() => {
    setDna(inputValue.split(/[,]|\n/).filter((line) => line.trim() !== ""));
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
        onClick={() => {
          console.log("Checking mutant status for DNA:", dna);
        }}
      >
        Is mutant?
      </button>
    </>
  );
}

export default App;
