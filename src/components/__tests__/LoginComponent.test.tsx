import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginComponent from "../LoginComponent";

describe("LoginComponent", () => {
  it("renders login form with username, password and button", () => {
    render(<LoginComponent />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors if username and password are empty", async () => {
    render(<LoginComponent />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/please input your username!/i)).toBeInTheDocument();
    expect(await screen.findByText(/please input your password!/i)).toBeInTheDocument();
  });

  it("shows error message on invalid credentials", async () => {
    render(<LoginComponent />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "wronguser" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongpass" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("calls onLoginSuccess on valid credentials", async () => {
    const onLoginSuccess = jest.fn();
    render(<LoginComponent onLoginSuccess={onLoginSuccess} />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "1234" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
