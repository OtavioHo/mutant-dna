import type { JSX } from "react";
import "./index.css";

const DnaMatrix = ({ dna }: { dna: string[] }): JSX.Element => {
  return (
    <div className="center-container">
      <div className="matrix-container">
        {dna.map((line, lineIndex) => (
          <div key={lineIndex} className="char-line">
            {line.split("").map((char, charIndex) => (
              <div key={charIndex} className="char-container">
                {char.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DnaMatrix;
