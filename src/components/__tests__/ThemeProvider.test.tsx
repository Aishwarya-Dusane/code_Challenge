// ThemeProvider.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "../ThemeProvider";
import { ConfigProvider } from "antd";

// Mock antd ConfigProvider to a simple div wrapper with a test-id
jest.mock("antd", () => ({
  ConfigProvider: jest.fn(({ children }) => <div data-testid="config-provider">{children}</div>),
}));

describe("ThemeProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders its children", () => {
    render(
      <ThemeProvider mode="dark">
        <div data-testid="child">Hello Theme</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("wraps children in ConfigProvider", () => {
    render(
      <ThemeProvider mode="light">
        <p>Wrapped content</p>
      </ThemeProvider>
    );
    expect(screen.getByTestId("config-provider")).toBeInTheDocument();
    expect(screen.getByText("Wrapped content")).toBeInTheDocument();
  });

  it("accepts both light and dark modes without errors", () => {
    const { rerender } = render(
      <ThemeProvider mode="light">
        <span>Light Mode</span>
      </ThemeProvider>
    );
    expect(screen.getByText("Light Mode")).toBeInTheDocument();

    rerender(
      <ThemeProvider mode="dark">
        <span>Dark Mode</span>
      </ThemeProvider>
    );
    expect(screen.getByText("Dark Mode")).toBeInTheDocument();
  });

  it("calls ConfigProvider with correct children", () => {
    render(
      <ThemeProvider mode="dark">
        <span>Child</span>
      </ThemeProvider>
    );

    // Cast ConfigProvider to jest.Mock to fix TS errors
    const mockedConfigProvider = ConfigProvider as unknown as jest.Mock;

    expect(mockedConfigProvider).toHaveBeenCalled();

    const callArgs = mockedConfigProvider.mock.calls[0][0];
    expect(callArgs.children).toBeTruthy();
  });
});
