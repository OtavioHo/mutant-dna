import "./StatsCard.css";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: "mutant" | "human" | "ratio";
}

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="stats-card-content">
        <h3 className="stats-card-title">{title}</h3>
        <p className="stats-card-value">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
