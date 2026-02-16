import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "../../../src/components/ui/Button";
import userEvent from "@testing-library/user-event";

describe("Button", () => {
  it("should render button with children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("should apply primary variant by default", () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-primary");
  });

  it("should apply secondary variant when specified", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-secondary");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should be disabled when loading prop is true", () => {
    render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should show spinner when loading", () => {
    render(<Button loading>Loading</Button>);
    const spinner = document.querySelector(".btn-spinner");
    expect(spinner).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should forward additional props", () => {
    render(<Button aria-label="Custom label">Button</Button>);
    const button = screen.getByRole("button", { name: /custom label/i });
    expect(button).toBeInTheDocument();
  });
});
