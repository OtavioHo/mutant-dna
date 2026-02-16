import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Message from "../../../src/components/ui/Message";

describe("Message", () => {
  it("should render message with children", () => {
    render(<Message type="success">Success message</Message>);
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  it("should apply correct class for success type", () => {
    render(<Message type="success">Success</Message>);
    const message = screen.getByRole("status");
    expect(message).toHaveClass("message-success");
  });

  it("should apply correct class for error type", () => {
    render(<Message type="error">Error</Message>);
    const message = screen.getByText("Error");
    expect(message).toHaveClass("message-error");
  });

  it("should apply correct class for loading type", () => {
    render(<Message type="loading">Loading</Message>);
    const message = screen.getByRole("status");
    expect(message).toHaveClass("message-loading");
  });

  it("should apply correct class for mutant type", () => {
    render(<Message type="mutant">Mutant detected</Message>);
    const message = screen.getByRole("status");
    expect(message).toHaveClass("message-mutant");
  });

  it("should apply correct class for human type", () => {
    render(<Message type="human">Human DNA</Message>);
    const message = screen.getByRole("status");
    expect(message).toHaveClass("message-human");
  });

  it("should render icon when provided", () => {
    render(
      <Message type="success" icon="✓">
        Success
      </Message>,
    );
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("should set icon as aria-hidden", () => {
    render(
      <Message type="success" icon="✓">
        Success
      </Message>,
    );
    const icon = screen.getByText("✓");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("should use default role status", () => {
    render(<Message type="success">Success</Message>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should allow custom role", () => {
    render(
      <Message type="error" role="alert">
        Error
      </Message>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should set aria-live to polite by default", () => {
    render(<Message type="success">Success</Message>);
    const message = screen.getByRole("status");
    expect(message).toHaveAttribute("aria-live", "polite");
  });

  it("should allow custom aria-live", () => {
    render(
      <Message type="error" ariaLive="assertive">
        Error
      </Message>,
    );
    const message = screen.getByText("Error");
    expect(message).toHaveAttribute("aria-live", "assertive");
  });
});
