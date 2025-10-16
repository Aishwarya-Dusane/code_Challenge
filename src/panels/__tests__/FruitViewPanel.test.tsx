import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FruitViewPanel } from "../FruitViewPanel";

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),    // deprecated but still used by some libs
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});


// 🧩 Mock Ant Design message API to avoid UI side effects
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    },
  };
});

const { message } = require("antd");

// 🧩 Mock MockFruitMachine to control inventory behavior
jest.mock("../../../engine/MockFruitMachine", () => {
  const mockInventory = { apple: 5, banana: 3, orange: 2 };
  const MockFruitMachine = jest.fn().mockImplementation(() => ({
    getInventory: jest.fn(() => ({ ...mockInventory })),
    buy: jest.fn((fruit: string, amount: number) => {
      if (mockInventory[fruit] >= amount) {
        mockInventory[fruit] -= amount;
        return true;
      }
      return false;
    }),
    sell: jest.fn((fruit: string, amount: number) => {
      mockInventory[fruit] += amount;
    }),
  }));

  return { MockFruitMachine, Fruit: ["apple", "banana", "orange"] };
});

describe("FruitViewPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates message and inventory when buying fruit successfully", () => {
    render(<FruitViewPanel />);

    // Click the Buy button
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    // Message text should appear
    expect(screen.getByText(/bought 1 apple/i)).toBeInTheDocument();

    // Message color is green
    const msg = screen.getByText(/bought/i);
    expect(msg).toHaveStyle("color: #52c41a");

    // Ant Design success message called
    expect(message.success).toHaveBeenCalledWith(expect.stringMatching(/bought/i));
  });

  it("shows error when buying too many fruits", () => {
    render(<FruitViewPanel />);

    // Increase amount beyond available inventory
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: 10 } });

    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    expect(screen.getByText(/not enough apple/i)).toBeInTheDocument();
    expect(message.error).toHaveBeenCalledWith(expect.stringMatching(/not enough/i));
  });

  it("updates message and inventory when selling fruit", () => {
    render(<FruitViewPanel />);

    // Click the Sell button
    fireEvent.click(screen.getByRole("button", { name: /sell/i }));

    // Message should indicate selling
    expect(screen.getByText(/sold 1 apple/i)).toBeInTheDocument();

    // Ant Design info message should be called
    expect(message.info).toHaveBeenCalledWith(expect.stringMatching(/sold/i));
  });

});
