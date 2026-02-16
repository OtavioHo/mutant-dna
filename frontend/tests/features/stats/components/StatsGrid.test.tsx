import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsGrid from "../../../../src/features/stats/components/StatsGrid";
import type { StatsResponse } from "../../../../src/types";

describe("StatsGrid", () => {
  const mockStats: StatsResponse = {
    count_mutant_dna: 10,
    count_human_dna: 20,
    ratio: 0.5,
  };

  it("should render all three stat cards", () => {
    render(<StatsGrid stats={mockStats} />);

    expect(screen.getByText("Mutant DNA")).toBeInTheDocument();
    expect(screen.getByText("Human DNA")).toBeInTheDocument();
    expect(screen.getByText("Mutant Ratio")).toBeInTheDocument();
  });

  it("should display correct values", () => {
    render(<StatsGrid stats={mockStats} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("50.0%")).toBeInTheDocument();
  });

  it("should format ratio as percentage", () => {
    const stats = { ...mockStats, ratio: 0.333 };
    render(<StatsGrid stats={stats} />);

    expect(screen.getByText("33.3%")).toBeInTheDocument();
  });

  it("should handle zero ratio", () => {
    const stats = { ...mockStats, ratio: 0 };
    render(<StatsGrid stats={stats} />);

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("should handle ratio of 1", () => {
    const stats = { ...mockStats, ratio: 1 };
    render(<StatsGrid stats={stats} />);

    expect(screen.getByText("100.0%")).toBeInTheDocument();
  });

  it("should have region role with label", () => {
    render(<StatsGrid stats={mockStats} />);
    const region = screen.getByRole("region", {
      name: /dna analysis statistics/i,
    });
    expect(region).toBeInTheDocument();
  });

  it("should render all icons", () => {
    render(<StatsGrid stats={mockStats} />);

    expect(screen.getByText("🧬")).toBeInTheDocument();
    expect(screen.getByText("👤")).toBeInTheDocument();
    expect(screen.getByText("📊")).toBeInTheDocument();
  });
});
