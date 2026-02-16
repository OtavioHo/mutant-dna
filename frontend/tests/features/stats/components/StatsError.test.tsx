import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsError from "../../../../src/features/stats/components/StatsError";

describe("StatsError", () => {
  it("should not render when error is null", () => {
    const { container } = render(<StatsError error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render error message when error exists", () => {
    const error = new Error("Failed to fetch");
    render(<StatsError error={error} />);

    expect(screen.getByText(/failed to load statistics/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
  });

  it("should have alert role", () => {
    const error = new Error("Test error");
    render(<StatsError error={error} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should have assertive aria-live", () => {
    const error = new Error("Test error");
    render(<StatsError error={error} />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "assertive");
  });

  it("should include screen reader text", () => {
    const error = new Error("Test error");
    render(<StatsError error={error} />);

    expect(screen.getByText(/error:/i)).toBeInTheDocument();
  });
});
