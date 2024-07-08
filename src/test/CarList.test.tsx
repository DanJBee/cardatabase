import { describe, expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CarList from "../components/CarList.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("CarList tests", () => {
  test("Component renders", () => {
    render(<CarList />, { wrapper });
  });

  test("Cars are fetched", async () => {
    render(<CarList />, { wrapper });

    await waitFor(() => screen.getByText(/New Car/i));
    expect(screen.getByText(/Nissan/i)).toBeInTheDocument();
  });

  test("Open new car modal", async () => {
    render(<CarList />, { wrapper });

    await waitFor(() => screen.getByText(/New Car/i));
    expect(screen.getByText(/Nissan/i)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/New Car/i));
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
    screen.getByRole("button", { name: "Save" });
  });
});
