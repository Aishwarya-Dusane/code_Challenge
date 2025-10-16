// UserProfile.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserProfile from "../UserProfile";
import { MESSAGES } from "../constants/messages";

describe("UserProfile", () => {
  const onLogout = jest.fn();
  const onThemeToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the user icon button", () => {
    render(<UserProfile onLogout={onLogout} />);
    const userButton = screen.getByRole("button");
    expect(userButton).toBeInTheDocument();
  });

  it("opens popover on user icon click", () => {
    render(<UserProfile onLogout={onLogout} />);
    const userButton = screen.getByRole("button");
    fireEvent.click(userButton);
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("user@email.com")).toBeInTheDocument();
    expect(screen.getByText("Do you want to log out?")).toBeInTheDocument();
  });

  it("calls onLogout and closes popover on logout button click", () => {
    render(<UserProfile onLogout={onLogout} />);
    fireEvent.click(screen.getByRole("button")); // Open popover

    const logoutBtn = screen.getByRole("button", { name: /log out/i });
    fireEvent.click(logoutBtn);

    expect(onLogout).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("User")).not.toBeInTheDocument();
  });

  it("closes popover on cancel button click without calling logout", () => {
    render(<UserProfile onLogout={onLogout} />);
    fireEvent.click(screen.getByRole("button")); // Open popover

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(onLogout).not.toHaveBeenCalled();
    expect(screen.queryByText("User")).not.toBeInTheDocument();
  });

  it("renders theme toggle switch when onThemeToggle is provided", () => {
    render(<UserProfile onLogout={onLogout} onThemeToggle={onThemeToggle} theme={MESSAGES.DARK} />);
    fireEvent.click(screen.getByRole("button")); // Open popover

    // Switch exists
    const switchInput = screen.getByRole("switch");
    expect(switchInput).toBeInTheDocument();

    // Label text shows opposite theme
    expect(screen.getByText(`${MESSAGES.LIGHT} Theme`)).toBeInTheDocument();
  });

  it("toggles theme when switch is clicked", () => {
    render(<UserProfile onLogout={onLogout} onThemeToggle={onThemeToggle} theme={MESSAGES.DARK} />);
    fireEvent.click(screen.getByRole("button")); // Open popover

    const switchInput = screen.getByRole("switch");
    fireEvent.click(switchInput);

    expect(onThemeToggle).toHaveBeenCalledTimes(1);
  });

  it("does not render theme toggle switch when onThemeToggle is not provided", () => {
    render(<UserProfile onLogout={onLogout} theme={MESSAGES.DARK} />);
    fireEvent.click(screen.getByRole("button")); // Open popover

    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
  });
});
