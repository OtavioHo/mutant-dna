import Message from "../../../components/ui/Message";
import { MESSAGES } from "../../../constants";

interface ValidationMessageProps {
  dnaLength: number;
  valid: boolean | null;
}

const ValidationMessage = ({ dnaLength, valid }: ValidationMessageProps) => {
  if (dnaLength === 0) return null;

  if (valid) {
    return (
      <Message type="success" icon="✓" role="status" ariaLive="polite">
        <span className="sr-only">Success: </span>
        {MESSAGES.VALID_DNA}
      </Message>
    );
  }

  return (
    <Message type="error" icon="✗" role="alert" ariaLive="assertive">
      <span className="sr-only">Error: </span>
      {MESSAGES.INVALID_DNA}
    </Message>
  );
};

export default ValidationMessage;
