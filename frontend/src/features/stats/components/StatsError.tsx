import Message from "../../../components/ui/Message";

interface StatsErrorProps {
  error: Error | null;
}

const StatsError = ({ error }: StatsErrorProps) => {
  if (!error) return null;

  return (
    <Message type="error" icon="⚠" role="alert" ariaLive="assertive">
      <span className="sr-only">Error: </span>
      Failed to load statistics: {error.message}
    </Message>
  );
};

export default StatsError;
