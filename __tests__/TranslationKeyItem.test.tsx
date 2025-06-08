import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TranslationKeyItem from "../app/components/TranslationKeyItem";
import useTransManagerStore from "../app/store/useTransManagerStore";
import toast from "react-hot-toast";

jest.mock("../app/store/useTransManagerStore");
jest.mock("react-hot-toast");

const transSample = {
  id: "1",
  key: "_greeting_",
  category: "",
  description: "",
  translations: {
    en: { value: "Hello", updatedAt: "2025-06-07", updatedBy: "abby@mail.com" },
    fr: { value: "Bonjour", updatedAt: "2025-06-07", updatedBy: "abby@mail.com" },
    es: { value: "Hola", updatedAt: "2025-06-07", updatedBy: "abby@mail.com" },
  },
};

describe("TranslationKeyItem", () => {
  const mockDeleteLocalization = jest.fn();
  const mockFetchLocalizations = jest.fn();
  const mockEditLocalization = jest.fn();
  const mockError = "";

  beforeEach(() => {
    jest.clearAllMocks();
    (useTransManagerStore as unknown as jest.Mock).mockReturnValue({
      selectedLanguages: [
        { code: "en", name: "English" },
        { code: "fr", name: "French" },
        { code: "es", name: "Spanish" },
      ],
      error: mockError,
      deleteLocalization: mockDeleteLocalization,
      fetchLocalizations: mockFetchLocalizations,
      editLocalization: mockEditLocalization,
    });
  });

  it("renders editable input with initial values", () => {
    render(<TranslationKeyItem trans={transSample} />);
    expect(screen.getByDisplayValue("_greeting_")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bonjour")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hola")).toBeInTheDocument();
  });

  it("updates translation key state on change", async () => {
    render(<TranslationKeyItem trans={transSample} />);
    const keyInput = screen.getByDisplayValue("_greeting_");

    await userEvent.clear(keyInput);
    await userEvent.type(keyInput, "_welcome_");

    await waitFor(() => {
        expect(keyInput).toHaveValue("_welcome_");
    });
  });

  it("does not call editLocalization if value is unchanged on blur", async () => {
    render(<TranslationKeyItem trans={transSample} />);
    const keyInput = screen.getByDisplayValue("_greeting_");

    fireEvent.blur(keyInput);

    await waitFor(() => {
      expect(mockEditLocalization).not.toHaveBeenCalled();
      expect(mockFetchLocalizations).not.toHaveBeenCalled();
    });
  });

  it("calls editLocalization and fetchLocalizations on blur when translation changed", async () => {
    mockEditLocalization.mockResolvedValueOnce(undefined);
    mockFetchLocalizations.mockResolvedValueOnce(undefined);

    render(<TranslationKeyItem trans={transSample} />);
    const enInput = screen.getByDisplayValue("Hello");

    fireEvent.change(enInput, { target: { value: "Hi" } });
    fireEvent.blur(enInput);

    await waitFor(() => {
      expect(mockEditLocalization).toHaveBeenCalledWith(
        expect.objectContaining({
          translations: expect.objectContaining({
            en: expect.objectContaining({ value: "Hi" }),
          }),
        })
      );
      expect(mockFetchLocalizations).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Translation key successfully updated!"
      );
    });
  });

  it("calls deleteLocalization and fetchLocalizations when delete button clicked", async () => {
    mockDeleteLocalization.mockResolvedValueOnce(undefined);
    mockFetchLocalizations.mockResolvedValueOnce(undefined);

    render(<TranslationKeyItem trans={transSample} />);
    const deleteBtn = screen.getByRole("button");

    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockDeleteLocalization).toHaveBeenCalledWith("1");
      expect(mockFetchLocalizations).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Translation key successfully deleted!"
      );
    });
  });
});
