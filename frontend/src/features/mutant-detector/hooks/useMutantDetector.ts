import { useState, useEffect } from "react";
import {
  parseDnaInput,
  isValidDnaSequence,
  filterDnaInput,
} from "../../../utils/dna.utils";

export const useMutantDetector = () => {
  const [dna, setDna] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [valid, setValid] = useState<boolean | null>(false);

  useEffect(() => {
    setDna(parseDnaInput(inputValue));
  }, [inputValue]);

  useEffect(() => {
    if (dna.length === 0) {
      setValid(false);
      return;
    }
    setValid(isValidDnaSequence(dna));
  }, [dna]);

  const handleInputChange = (value: string) => {
    const filtered = filterDnaInput(value);
    setInputValue(filtered);
  };

  return {
    dna,
    inputValue,
    valid,
    handleInputChange,
  };
};
