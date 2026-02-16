import { useStats } from "./hooks/useStats";
import StatsGrid from "./components/StatsGrid";
import StatsLoading from "./components/StatsLoading";
import StatsError from "./components/StatsError";
import Button from "../../components/ui/Button";
import "./Stats.css";

interface StatsProps {
  autoFetch?: boolean;
  showRefresh?: boolean;
}

const Stats = ({ autoFetch = true, showRefresh = true }: StatsProps) => {
  const { stats, loading, error, refetch } = useStats(autoFetch);

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>DNA Analysis Statistics</h2>
        {showRefresh && (
          <Button
            onClick={refetch}
            disabled={loading}
            loading={loading}
            variant="secondary"
            aria-label="Refresh statistics"
          >
            🔄 Refresh
          </Button>
        )}
      </div>

      {loading && !stats && <StatsLoading />}
      {error && <StatsError error={error} />}
      {stats && <StatsGrid stats={stats} />}
    </div>
  );
};

export default Stats;
