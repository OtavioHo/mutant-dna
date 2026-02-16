import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingMessage from "../../../../src/features/mutant-detector/components/LoadingMessage";

describe("LoadingMessage", () => {
  it("should not render when loading is false", () => {
    const { container } = render(<LoadingMessage loading={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render when loading is true", () => {
    render(<LoadingMessage loading={true} />);
    expect(screen.getByText(/analyzing dna sequence/i)).toBeInTheDocument();
  });

  it("should render spinner when loading", () => {
    const { container } = render(<LoadingMessage loading={true} />);
    const spinner = container.querySelector(".spinner");
    expect(spinner).toBeInTheDocument();
  });

  it("should have correct ARIA attributes", () => {
    render(<LoadingMessage loading={true} />);
    const message = screen.getByRole("status");
    expect(message).toHaveAttribute("aria-live", "polite");
  });

  it("should mark spinner as aria-hidden", () => {
    const { container } = render(<LoadingMessage loading={true} />);
    const spinner = container.querySelector(".spinner");
    expect(spinner).toHaveAttribute("aria-hidden", "true");
  });
});
