import "./StatsLoading.css";

const StatsLoading = () => {
  return (
    <div className="stats-loading-container" role="status" aria-live="polite">
      <div className="stats-skeleton stats-card-skeleton">
        <div className="skeleton-icon"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-value"></div>
        </div>
      </div>
      <div className="stats-skeleton stats-card-skeleton">
        <div className="skeleton-icon"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-value"></div>
        </div>
      </div>
      <div className="stats-skeleton stats-card-skeleton">
        <div className="skeleton-icon"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-value"></div>
        </div>
      </div>
      <span className="sr-only">Loading statistics...</span>
    </div>
  );
};

export default StatsLoading;
