import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom/vitest";

describe("App test", () => {
  test("Component renders", () => {
    render(<App />);
    expect(screen.getByText(/Car Shop/i)).toBeDefined();
    expect(screen.getByText(/Car Shop/i)).toBeInTheDocument();
  });
});
