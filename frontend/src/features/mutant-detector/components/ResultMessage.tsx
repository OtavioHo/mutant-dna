import Message from "../../../components/ui/Message";
import { MESSAGES } from "../../../constants";

interface ResultMessageProps {
  code: number | null;
}

const ResultMessage = ({ code }: ResultMessageProps) => {
  if (code === null) return null;

  if (code === 200) {
    return (
      <Message type="mutant" icon="🧬" role="status" ariaLive="polite">
        <span className="sr-only">Analysis complete: </span>
        {MESSAGES.MUTANT_DETECTED}
      </Message>
    );
  }

  return (
    <Message type="human" icon="👤" role="status" ariaLive="polite">
      <span className="sr-only">Analysis complete: </span>
      {MESSAGES.HUMAN_DNA}
    </Message>
  );
};

export default ResultMessage;
