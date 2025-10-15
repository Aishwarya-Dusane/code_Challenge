import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginComponent from "../LoginComponent";

describe("LoginComponent", () => {
  it("renders login title and form fields", () => {
    render(<LoginComponent />);

    // Title
    expect(screen.getByText("Login")).toBeInTheDocument();

    // Input fields
    expect(screen.getByPlaceholderText("Enter your username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();

    // Button
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows error message for invalid credentials", async () => {
    render(<LoginComponent />);

    const usernameInput = screen.getByPlaceholderText("Enter your username");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    // Enter wrong credentials
    await userEvent.type(usernameInput, "wronguser");
    await userEvent.type(passwordInput, "wrongpass");
    fireEvent.click(submitButton);

    // Expect error message
    await waitFor(() =>
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
    );
  });

  it("calls onLoginSuccess for correct credentials", async () => {
    const mockLoginSuccess = jest.fn();
    render(<LoginComponent onLoginSuccess={mockLoginSuccess} />);

    const usernameInput = screen.getByPlaceholderText("Enter your username");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    // Correct credentials
    await userEvent.type(usernameInput, "admin");
    await userEvent.type(passwordInput, "1234");
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockLoginSuccess).toHaveBeenCalled());
  });

  it("does not show error message initially", () => {
    render(<LoginComponent />);
    expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
  });

  it("renders the login container with correct background", () => {
    render(<LoginComponent />);
    const container = screen.getByTestId("login-component");
    expect(container).toHaveStyle("background: #232b3e");
  });
});
