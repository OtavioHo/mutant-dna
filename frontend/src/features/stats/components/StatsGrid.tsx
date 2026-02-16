import type { StatsResponse } from "../../../types";
import StatsCard from "./StatsCard";
import "./StatsGrid.css";

interface StatsGridProps {
  stats: StatsResponse;
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  const formatRatio = (ratio: number): string => {
    if (ratio === 0) return "0%";
    return `${(ratio * 100).toFixed(1)}%`;
  };

  return (
    <div
      className="stats-grid"
      role="region"
      aria-label="DNA Analysis Statistics"
    >
      <StatsCard
        title="Mutant DNA"
        value={stats.count_mutant_dna}
        icon="🧬"
        color="mutant"
      />
      <StatsCard
        title="Human DNA"
        value={stats.count_human_dna}
        icon="👤"
        color="human"
      />
      <StatsCard
        title="Mutant Ratio"
        value={formatRatio(stats.ratio)}
        icon="📊"
        color="ratio"
      />
    </div>
  );
};

export default StatsGrid;
