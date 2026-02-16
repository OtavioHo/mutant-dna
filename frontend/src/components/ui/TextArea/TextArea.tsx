import React from "react";
import "./TextArea.css";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="textarea-wrapper">
        {label && <label className="textarea-label">{label}</label>}
        <textarea
          ref={ref}
          className={`textarea ${error ? "textarea-error" : ""}`}
          {...props}
        />
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
