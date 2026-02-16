import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsLoading from "../../../../src/features/stats/components/StatsLoading";

describe("StatsLoading", () => {
  it("should render loading skeletons", () => {
    const { container } = render(<StatsLoading />);
    const skeletons = container.querySelectorAll(".stats-card-skeleton");
    expect(skeletons).toHaveLength(3);
  });

  it("should have status role", () => {
    render(<StatsLoading />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should have aria-live polite", () => {
    render(<StatsLoading />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("should include screen reader text", () => {
    render(<StatsLoading />);
    expect(screen.getByText(/loading statistics/i)).toBeInTheDocument();
  });

  it("should render skeleton icons", () => {
    const { container } = render(<StatsLoading />);
    const icons = container.querySelectorAll(".skeleton-icon");
    expect(icons).toHaveLength(3);
  });

  it("should render skeleton content", () => {
    const { container } = render(<StatsLoading />);
    const titles = container.querySelectorAll(".skeleton-title");
    const values = container.querySelectorAll(".skeleton-value");

    expect(titles).toHaveLength(3);
    expect(values).toHaveLength(3);
  });
});
