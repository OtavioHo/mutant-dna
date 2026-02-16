import type { MessageProps } from "../../../types";
import "./Message.css";

const Message = ({
  type,
  children,
  icon,
  role = "status",
  ariaLive = "polite",
}: MessageProps) => {
  return (
    <p className={`message message-${type}`} role={role} aria-live={ariaLive}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </p>
  );
};

export default Message;
