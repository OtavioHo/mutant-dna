import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ValidationMessage from "../../../../src/features/mutant-detector/components/ValidationMessage";

describe("ValidationMessage", () => {
  it("should not render when dnaLength is 0", () => {
    const { container } = render(
      <ValidationMessage dnaLength={0} valid={true} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render success message when valid is true", () => {
    render(<ValidationMessage dnaLength={3} valid={true} />);
    expect(screen.getByText(/valid dna sequence/i)).toBeInTheDocument();
  });

  it("should render error message when valid is false", () => {
    render(<ValidationMessage dnaLength={3} valid={false} />);
    expect(screen.getByText(/invalid dna sequence/i)).toBeInTheDocument();
  });

  it("should render with correct role for success", () => {
    render(<ValidationMessage dnaLength={3} valid={true} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render with correct role for error", () => {
    render(<ValidationMessage dnaLength={3} valid={false} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should include screen reader text", () => {
    render(<ValidationMessage dnaLength={3} valid={true} />);
    expect(screen.getByText(/success:/i)).toBeInTheDocument();
  });
});
