import Message from "../../../components/ui/Message";

interface ErrorMessageProps {
  error: Error | null;
  code: number | null;
}

const ErrorMessage = ({ error, code }: ErrorMessageProps) => {
  if (!error || code === 403) return null;

  return (
    <Message type="error" icon="⚠" role="alert" ariaLive="assertive">
      <span className="sr-only">Error: </span>
      {error.message}
    </Message>
  );
};

export default ErrorMessage;
