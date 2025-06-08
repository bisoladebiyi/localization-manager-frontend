import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TranslationKeyManager from "../app/components/TranslationKeyManager";
import useTransManagerStore from "../app/store/useTransManagerStore";
import toast from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../app/store/useTransManagerStore");
jest.mock("react-hot-toast");

const mockRefetch = jest.fn();
const mockCreateMutate = jest.fn();

jest.mock("../app/hooks/useLocalizations", () => ({
  useLocalizations: () => ({
    refetch: mockRefetch,
  }),
}));

jest.mock("../app/hooks/useCreateLocalization", () => ({
  useCreateLocalization: () => ({
    mutate: mockCreateMutate,
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const mockUseTransManagerStore = useTransManagerStore as jest.MockedFunction<
  typeof useTransManagerStore
>;
const mockToastSuccess = toast.success as jest.MockedFunction<
  typeof toast.success
>;

describe("TranslationKeyManager", () => {
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
    });
  });

  it("displays table headers including selected language codes", () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyManager
          handleTransSearch={(keys) => keys || []}
          isAddNew={false}
          setIsAddNew={jest.fn()}
        />
      </QueryClientProvider>
    );

    expect(screen.getByText("Key")).toBeInTheDocument();
    expect(screen.getByText("en")).toBeInTheDocument();
    expect(screen.getByText("fr")).toBeInTheDocument();
    expect(screen.getByText("es")).toBeInTheDocument();
  });

  it("shows add new inputs when isAddNew is true", () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyManager
          handleTransSearch={(keys) => keys || []}
          isAddNew={true}
          setIsAddNew={jest.fn()}
        />
      </QueryClientProvider>
    );

    expect(screen.getByPlaceholderText("Enter Key")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter value for en")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter value for fr")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter value for es")
    ).toBeInTheDocument();
  });

  it("calls setIsAddNew(false) when cancel button clicked", () => {
    const mockSetIsAddNew = jest.fn();
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyManager
          handleTransSearch={(keys) => keys || []}
          isAddNew={true}
          setIsAddNew={mockSetIsAddNew}
        />
      </QueryClientProvider>
    );

    const cancelButton = screen.getByTestId("close-add-new-inputs");
    fireEvent.click(cancelButton);

    expect(mockSetIsAddNew).toHaveBeenCalledWith(false);
  });

  it("adds new translation successfully", async () => {
    const mockSetIsAddNew = jest.fn();
    const queryClient = createTestQueryClient();
    mockCreateMutate.mockImplementation((data, callbacks) =>
      callbacks.onSuccess()
    );

    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyManager
          handleTransSearch={(keys) => keys || []}
          isAddNew={true}
          setIsAddNew={mockSetIsAddNew}
        />
      </QueryClientProvider>
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
      expect(mockCreateMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "_thanks_",
          translations: expect.objectContaining({
            en: expect.objectContaining({ value: "Thanks" }),
            es: expect.objectContaining({ value: "Gracias" }),
            fr: expect.objectContaining({ value: "Merci" }),
          }),
        }),
        expect.any(Object)
      );

      expect(mockRefetch).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Translation key successfully created!"
      );
      expect(mockSetIsAddNew).toHaveBeenCalledWith(false);
    });
  });
});
