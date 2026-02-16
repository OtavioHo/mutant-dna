import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TextArea from "../../../src/components/ui/TextArea";
import userEvent from "@testing-library/user-event";

describe("TextArea", () => {
  it("should render textarea", () => {
    render(<TextArea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  it("should render with label when provided", () => {
    render(<TextArea label="DNA Sequence" />);
    expect(screen.getByText("DNA Sequence")).toBeInTheDocument();
  });

  it("should apply error class when error prop is true", () => {
    render(<TextArea error />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("textarea-error");
  });

  it("should display placeholder", () => {
    render(<TextArea placeholder="Enter DNA..." />);
    const textarea = screen.getByPlaceholderText("Enter DNA...");
    expect(textarea).toBeInTheDocument();
  });

  it("should handle onChange event", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TextArea onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "ATGC");

    expect(handleChange).toHaveBeenCalled();
  });

  it("should display value", () => {
    render(<TextArea value="ATGCGA" readOnly />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("ATGCGA");
  });

  it("should forward aria attributes", () => {
    render(<TextArea aria-label="DNA input" aria-invalid={true} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-label", "DNA input");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<TextArea disabled />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
  });
});
