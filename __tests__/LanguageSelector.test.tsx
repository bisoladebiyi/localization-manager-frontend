import { render, screen } from "@testing-library/react";
import LanguageSelector from "../app/components/LanguageSelector";
import userEvent from "@testing-library/user-event";

describe("LanguageSelector", () => {
  it("renders a list of available language for translations", () => {
    render(<LanguageSelector />);

    expect(screen.getByText(/English\s*\(en\)/)).toBeInTheDocument();
    expect(screen.getByText(/French\s*\(fr\)/)).toBeInTheDocument();
    expect(screen.getByText(/Spanish\s*\(es\)/)).toBeInTheDocument();
  });

  it("toggles class when a language is selected", async () => {
    render(<LanguageSelector />);
    const user = userEvent.setup();

    const englishOption = screen.getByText(/English\s*\(en\)/);
    const hasBgClass = englishOption.classList.contains("bg-gray-100");

    await user.click(englishOption);

    if (hasBgClass) {
      expect(englishOption).not.toHaveClass("bg-gray-100");
    } else {
      expect(englishOption).toHaveClass("bg-gray-100");
    }
  });
});
