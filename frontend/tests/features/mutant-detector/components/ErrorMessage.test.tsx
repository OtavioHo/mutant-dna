import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "../../../../src/features/mutant-detector/components/ErrorMessage";

describe("ErrorMessage", () => {
  it("should not render when error is null", () => {
    const { container } = render(<ErrorMessage error={null} code={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should not render when code is 403", () => {
    const error = new Error("Forbidden");
    const { container } = render(<ErrorMessage error={error} code={403} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render error message when error exists", () => {
    const error = new Error("Network error");
    render(<ErrorMessage error={error} code={500} />);
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  it("should have alert role", () => {
    const error = new Error("Test error");
    render(<ErrorMessage error={error} code={500} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should have assertive aria-live", () => {
    const error = new Error("Test error");
    render(<ErrorMessage error={error} code={500} />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "assertive");
  });

  it("should include screen reader text", () => {
    const error = new Error("Test error");
    render(<ErrorMessage error={error} code={500} />);
    expect(screen.getByText(/error:/i)).toBeInTheDocument();
  });
});
