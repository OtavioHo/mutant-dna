import Message from "../../../components/ui/Message";
import { MESSAGES } from "../../../constants";
import "./LoadingMessage.css";

interface LoadingMessageProps {
  loading: boolean;
}

const LoadingMessage = ({ loading }: LoadingMessageProps) => {
  if (!loading) return null;

  return (
    <Message type="loading" role="status" ariaLive="polite">
      <span className="spinner" aria-hidden="true"></span>
      <span>{MESSAGES.ANALYZING}</span>
    </Message>
  );
};

export default LoadingMessage;
