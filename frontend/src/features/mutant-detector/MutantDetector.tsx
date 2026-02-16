import { useEffect } from "react";
import { useCheckMutant } from "../../api/mutants";
import { useMutantDetector } from "./hooks/useMutantDetector";
import DnaMatrix from "../../components/DnaMatrix";
import TextArea from "../../components/ui/TextArea";
import Button from "../../components/ui/Button";
import ValidationMessage from "./components/ValidationMessage";
import LoadingMessage from "./components/LoadingMessage";
import ErrorMessage from "./components/ErrorMessage";
import ResultMessage from "./components/ResultMessage";
import {
  DNA_INPUT_PLACEHOLDER,
  DNA_INPUT_ARIA_LABEL,
  MESSAGES,
} from "../../constants";
import "./MutantDetector.css";

const MutantDetector = () => {
  const { dna, inputValue, valid, handleInputChange } = useMutantDetector();
  const {
    execute: checkMutant,
    loading: loadingCheckMutant,
    error: errorCheckMutant,
    code: codeCheckMutant,
    reset: resetCheckMutant,
  } = useCheckMutant();

  useEffect(() => {
    if (codeCheckMutant !== null) {
      resetCheckMutant();
    }
  }, [inputValue]);

  return (
    <div className="mutant-detector">
      <h1>DNA Mutant Detector</h1>

      <TextArea
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={DNA_INPUT_PLACEHOLDER}
        aria-label={DNA_INPUT_ARIA_LABEL}
        aria-invalid={dna.length > 0 && !valid}
        error={dna.length > 0 && !valid}
      />

      <DnaMatrix dna={dna} />

      <ValidationMessage dnaLength={dna.length} valid={valid} />

      <Button
        disabled={!valid || loadingCheckMutant}
        loading={loadingCheckMutant}
        onClick={() => checkMutant(dna)}
        aria-label={
          loadingCheckMutant ? MESSAGES.CHECKING : MESSAGES.CHECK_MUTANT
        }
      >
        Is mutant?
      </Button>

      <LoadingMessage loading={loadingCheckMutant} />
      <ErrorMessage error={errorCheckMutant} code={codeCheckMutant} />
      <ResultMessage code={codeCheckMutant} />
    </div>
  );
};

export default MutantDetector;
