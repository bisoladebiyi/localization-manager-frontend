import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TranslationKeyManager from "../app/components/TranslationKeyManager";
import useTransManagerStore from "../app/store/useTransManagerStore";
import toast from "react-hot-toast";

jest.mock("../app/store/useTransManagerStore");
jest.mock("react-hot-toast");

const mockUseTransManagerStore = useTransManagerStore as jest.MockedFunction<
  typeof useTransManagerStore
>;
const mockToastSuccess = toast.success as jest.MockedFunction<
  typeof toast.success
>;

describe("TranslationKeyManager", () => {
  const mockFetchLocalizations = jest.fn();
  const mockCreateLocalization = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTransManagerStore.mockReturnValue({
      selectedLanguages: [
        { code: "en", name: "English" },
        { code: "fr", name: "French" },
        { code: "es", name: "Spanish" },
      ],
      translationKeys: [
        {
          id: "1",
          key: "_greeting_",
          category: "",
          description: "",
          translations: {
            en: { value: "Hello", updatedAt: "", updatedBy: "" },
            fr: { value: "Bonjour", updatedAt: "", updatedBy: "" },
            es: { value: "Hola", updatedAt: "", updatedBy: "" },
          },
        },
      ],
      user: { email: "test@example.com", name: "Tester" },
      error: null,
      createLocalization: mockCreateLocalization,
      fetchLocalizations: mockFetchLocalizations,
    });
  });

  it("displays table headers including selected language codes", () => {
    render(
      <TranslationKeyManager
        handleTransSearch={(keys) => keys}
        isAddNew={false}
        setIsAddNew={jest.fn()}
      />
    );

    expect(screen.getByText("Key")).toBeInTheDocument();
    expect(screen.getByText("en")).toBeInTheDocument();
    expect(screen.getByText("fr")).toBeInTheDocument();
    expect(screen.getByText("es")).toBeInTheDocument();
  });

  it("shows add new inputs when isAddNew is true", () => {
    render(
      <TranslationKeyManager
        handleTransSearch={(keys) => keys}
        isAddNew={true}
        setIsAddNew={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText("Enter Key")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter value for en")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter value for fr")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter value for es")).toBeInTheDocument();
  });

  it("calls setIsAddNew(false) when cancel button clicked", () => {
    const mockSetIsAddNew = jest.fn();

    render(
      <TranslationKeyManager
        handleTransSearch={(keys) => keys}
        isAddNew={true}
        setIsAddNew={mockSetIsAddNew}
      />
    );

    const cancelButton = screen.getByTestId("close-add-new-inputs")
    fireEvent.click(cancelButton);

    expect(mockSetIsAddNew).toHaveBeenCalledWith(false);
  });

  it("adds new translation successfully", async () => {
    const mockSetIsAddNew = jest.fn();

    mockCreateLocalization.mockResolvedValueOnce({});
    mockFetchLocalizations.mockResolvedValueOnce({});

    render(
      <TranslationKeyManager
        handleTransSearch={(keys) => keys}
        isAddNew={true}
        setIsAddNew={mockSetIsAddNew}
      />
    );

    const keyInput = screen.getByPlaceholderText("Enter Key");
    await userEvent.type(keyInput, "_thanks_");

    const enInput = screen.getByPlaceholderText("Enter value for en");
    await userEvent.type(enInput, "Thanks");

    const frInput = screen.getByPlaceholderText("Enter value for fr");
    await userEvent.type(frInput, "Merci");

    const esInput = screen.getByPlaceholderText("Enter value for es");
    await userEvent.type(esInput, "Gracias");

    const submitButton = screen.getByTestId("add-translation-key");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateLocalization).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "_thanks_",
          translations: expect.objectContaining({
            en: expect.objectContaining({ value: "Thanks" }),
            fr: expect.objectContaining({ value: "Merci" }),
            es: expect.objectContaining({ value: "Gracias" }),
          }),
        })
      );

      expect(mockFetchLocalizations).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith("Translation key successfully created!");
      expect(mockSetIsAddNew).toHaveBeenCalledWith(false);
    });
  });
});
