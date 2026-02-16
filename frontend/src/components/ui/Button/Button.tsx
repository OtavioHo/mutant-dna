import React from "react";
import "./Button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", loading, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`btn btn-${variant}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="btn-spinner" aria-hidden="true"></span>}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
