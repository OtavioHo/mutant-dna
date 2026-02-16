import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ResultMessage from "../../../../src/features/mutant-detector/components/ResultMessage";

describe("ResultMessage", () => {
  it("should not render when code is null", () => {
    const { container } = render(<ResultMessage code={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render mutant message when code is 200", () => {
    render(<ResultMessage code={200} />);
    expect(screen.getByText(/mutant detected/i)).toBeInTheDocument();
  });

  it("should render human message when code is not 200", () => {
    render(<ResultMessage code={403} />);
    expect(screen.getByText(/human dna/i)).toBeInTheDocument();
  });

  it("should have status role", () => {
    render(<ResultMessage code={200} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should have polite aria-live", () => {
    render(<ResultMessage code={200} />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("should include screen reader text for analysis complete", () => {
    render(<ResultMessage code={200} />);
    expect(screen.getByText(/analysis complete:/i)).toBeInTheDocument();
  });

  it("should render emoji icons", () => {
    render(<ResultMessage code={200} />);
    expect(screen.getByText("🧬")).toBeInTheDocument();
  });
});
