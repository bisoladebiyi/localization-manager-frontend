import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TranslationKeyItem from "../app/components/TranslationKeyItem";
import useTransManagerStore from "../app/store/useTransManagerStore";
import toast from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockRefetch = jest.fn();
const mockEditMutate = jest.fn();
const mockDeleteMutate = jest.fn();

jest.mock("../app/hooks/useLocalizations", () => ({
  useLocalizations: () => ({
    refetch: mockRefetch,
  }),
}));

jest.mock("../app/hooks/useEditLocalization", () => ({
  useEditLocalization: () => ({
    mutate: mockEditMutate,
  }),
}));

jest.mock("../app/hooks/useDeleteLocalizations", () => ({
  useDeleteLocalization: () => ({
    mutate: mockDeleteMutate,
  }),
}));

jest.mock("../app/store/useTransManagerStore");

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const transSample = {
  id: "1",
  key: "_greeting_",
  category: "",
  description: "",
  translations: {
    en: { value: "Hello", updatedAt: "2025-06-07", updatedBy: "abby@mail.com" },
    fr: {
      value: "Bonjour",
      updatedAt: "2025-06-07",
      updatedBy: "abby@mail.com",
    },
    es: { value: "Hola", updatedAt: "2025-06-07", updatedBy: "abby@mail.com" },
  },
};

describe("TranslationKeyItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTransManagerStore as unknown as jest.Mock).mockReturnValue({
      selectedLanguages: [
        { code: "en", name: "English" },
        { code: "fr", name: "French" },
        { code: "es", name: "Spanish" },
      ],
    });
  });

  it("renders editable input with initial values", () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyItem trans={transSample} />
      </QueryClientProvider>
    );
    expect(screen.getByDisplayValue("_greeting_")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bonjour")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hola")).toBeInTheDocument();
  });

  it("updates translation key state on change", async () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyItem trans={transSample} />
      </QueryClientProvider>
    );
    const keyInput = screen.getByDisplayValue("_greeting_");

    await userEvent.clear(keyInput);
    await userEvent.type(keyInput, "_welcome_");

    await waitFor(() => {
      expect(keyInput).toHaveValue("_welcome_");
    });
  });

  it("does not call editLocalization.mutate if value is unchanged on blur", async () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyItem trans={transSample} />
      </QueryClientProvider>
    );
    const keyInput = screen.getByDisplayValue("_greeting_");

    fireEvent.blur(keyInput);

    await waitFor(() => {
      expect(mockEditMutate).not.toHaveBeenCalled();
      expect(mockRefetch).not.toHaveBeenCalled();
    });
  });

  it("calls editLocalization.mutate and fetchLocalizations on blur when translation changed", async () => {
    mockEditMutate.mockImplementation((data, callbacks) =>
      callbacks.onSuccess()
    );

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyItem trans={transSample} />
      </QueryClientProvider>
    );
    const enInput = screen.getByDisplayValue("Hello");

    fireEvent.change(enInput, { target: { value: "Hi" } });
    fireEvent.blur(enInput);

    await waitFor(() => {
      expect(mockEditMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          translations: expect.objectContaining({
            en: expect.objectContaining({ value: "Hi" }),
          }),
        }),
        expect.any(Object)
      );
      expect(mockRefetch).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Translation key successfully updated!"
      );
    });
  });

  it("calls deleteLocalization and fetchLocalizations when delete button clicked", async () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TranslationKeyItem trans={transSample} />
      </QueryClientProvider>
    );

    mockDeleteMutate.mockImplementation((id, { onSuccess }) => onSuccess());
    const deleteBtn = screen.getByRole("button");

    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Translation key successfully deleted!"
      );
    });
  });
});
