import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsCard from "../../../../src/features/stats/components/StatsCard";

describe("StatsCard", () => {
  it("should render title and value", () => {
    render(
      <StatsCard title="Mutant DNA" value={42} icon="🧬" color="mutant" />,
    );

    expect(screen.getByText("Mutant DNA")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("should render icon", () => {
    render(<StatsCard title="Test" value={10} icon="🧬" color="mutant" />);
    expect(screen.getByText("🧬")).toBeInTheDocument();
  });

  it("should apply mutant color class", () => {
    const { container } = render(
      <StatsCard title="Test" value={10} icon="🧬" color="mutant" />,
    );
    expect(container.querySelector(".stats-card-mutant")).toBeInTheDocument();
  });

  it("should apply human color class", () => {
    const { container } = render(
      <StatsCard title="Test" value={10} icon="👤" color="human" />,
    );
    expect(container.querySelector(".stats-card-human")).toBeInTheDocument();
  });

  it("should apply ratio color class", () => {
    const { container } = render(
      <StatsCard title="Test" value="50%" icon="📊" color="ratio" />,
    );
    expect(container.querySelector(".stats-card-ratio")).toBeInTheDocument();
  });

  it("should display string values", () => {
    render(<StatsCard title="Ratio" value="50%" icon="📊" color="ratio" />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("should mark icon as aria-hidden", () => {
    render(<StatsCard title="Test" value={10} icon="🧬" color="mutant" />);
    const icon = screen.getByText("🧬");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
