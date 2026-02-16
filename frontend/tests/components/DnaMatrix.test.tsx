import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DnaMatrix from "../../src/components/DnaMatrix";

describe("DnaMatrix", () => {
  it("should render empty matrix when dna array is empty", () => {
    const { container } = render(<DnaMatrix dna={[]} />);
    const matrixContainer = container.querySelector(".matrix-container");
    expect(matrixContainer?.children).toHaveLength(0);
  });

  it("should render DNA sequence correctly", () => {
    const dna = ["ATG", "CGA", "TTT"];
    render(<DnaMatrix dna={dna} />);

    const { container } = render(<DnaMatrix dna={dna} />);
    const rows = container.querySelectorAll(".char-line");

    // Check first row: ATG
    const row0Chars = rows[0].querySelectorAll(".char-container");
    expect(row0Chars[0].textContent).toBe("A");
    expect(row0Chars[1].textContent).toBe("T");
    expect(row0Chars[2].textContent).toBe("G");

    // Check second row: CGA
    const row1Chars = rows[1].querySelectorAll(".char-container");
    expect(row1Chars[0].textContent).toBe("C");
    expect(row1Chars[1].textContent).toBe("G");
    expect(row1Chars[2].textContent).toBe("A");

    // Check third row: TTT
    const row2Chars = rows[2].querySelectorAll(".char-container");
    expect(row2Chars[0].textContent).toBe("T");
    expect(row2Chars[1].textContent).toBe("T");
    expect(row2Chars[2].textContent).toBe("T");
  });

  it("should render correct number of rows", () => {
    const dna = ["ATG", "CGA", "TTT"];
    const { container } = render(<DnaMatrix dna={dna} />);
    const rows = container.querySelectorAll(".char-line");
    expect(rows).toHaveLength(3);
  });

  it("should render correct number of characters per row", () => {
    const dna = ["ATGC"];
    const { container } = render(<DnaMatrix dna={dna} />);
    const chars = container.querySelectorAll(".char-container");
    expect(chars).toHaveLength(4);
  });

  it("should convert characters to uppercase", () => {
    const dna = ["atgc"];
    render(<DnaMatrix dna={dna} />);

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByText("G")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("should render a 6x6 matrix correctly", () => {
    const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
    const { container } = render(<DnaMatrix dna={dna} />);

    const rows = container.querySelectorAll(".char-line");
    expect(rows).toHaveLength(6);

    const chars = container.querySelectorAll(".char-container");
    expect(chars).toHaveLength(36); // 6x6 = 36
  });

  it("should have center container wrapper", () => {
    const dna = ["ATG"];
    const { container } = render(<DnaMatrix dna={dna} />);
    const centerContainer = container.querySelector(".center-container");
    expect(centerContainer).toBeInTheDocument();
  });
});
