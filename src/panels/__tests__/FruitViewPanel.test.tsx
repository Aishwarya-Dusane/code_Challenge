import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FruitViewPanel } from "../FruitViewPanel";

// 🧩 Mock antd message module
const mockSuccess = jest.fn();
const mockError = jest.fn();
const mockInfo = jest.fn();

jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  return {
    ...antd,
    message: {
      success: (...args: any[]) => mockSuccess(...args),
      error: (...args: any[]) => mockError(...args),
      info: (...args: any[]) => mockInfo(...args),
    },
  };
});

// 🧩 Mock FruitMachine behavior
const mockBuy = jest.fn();
const mockSell = jest.fn();
const mockGetInventory = jest.fn();

jest.mock("../../engine/MockFruitMachine", () => {
  return {
    MockFruitMachine: jest.fn().mockImplementation(() => ({
      buy: mockBuy,
      sell: mockSell,
      getInventory: mockGetInventory,
    })),
  };
});

describe("FruitViewPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default inventory
    mockGetInventory.mockReturnValue({
      apple: 10,
      banana: 8,
      orange: 5,
    });
  });

  it("renders the form and inventory correctly", () => {
    render(<FruitViewPanel />);

    expect(screen.getByText("Fruit View")).toBeInTheDocument();
    expect(screen.getByText("Inventory")).toBeInTheDocument();
    expect(screen.getByText(/apple:/i)).toBeInTheDocument();
    expect(screen.getByText(/banana:/i)).toBeInTheDocument();
    expect(screen.getByText(/orange:/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Buy/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sell/i })).toBeInTheDocument();
  });

  it("handles successful buy", () => {
    mockBuy.mockReturnValue(true);
    render(<FruitViewPanel />);

    const buyBtn = screen.getByRole("button", { name: /Buy/i });
    fireEvent.click(buyBtn);

    expect(mockBuy).toHaveBeenCalledWith("apple", 1);
    expect(mockSuccess).toHaveBeenCalledWith("Bought 1 apple(s).");
    expect(screen.getByText("Bought 1 apple(s).")).toBeInTheDocument();
  });

  it("handles failed buy (not enough inventory)", () => {
    mockBuy.mockReturnValue(false);
    render(<FruitViewPanel />);

    fireEvent.click(screen.getByRole("button", { name: /Buy/i }));

    expect(mockBuy).toHaveBeenCalledWith("apple", 1);
    expect(mockError).toHaveBeenCalledWith("Not enough apples in inventory.");
    expect(screen.getByText("Not enough apples in inventory.")).toBeInTheDocument();
  });

  it("handles selling fruit", () => {
    render(<FruitViewPanel />);

    const sellBtn = screen.getByRole("button", { name: /Sell/i });
    fireEvent.click(sellBtn);

    expect(mockSell).toHaveBeenCalledWith("apple", 1);
    expect(mockInfo).toHaveBeenCalledWith("Sold 1 apple(s).");
    expect(screen.getByText("Sold 1 apple(s).")).toBeInTheDocument();
  });

  it("updates selected fruit and amount", () => {
    render(<FruitViewPanel />);

    // Select dropdown changes
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "banana" } });
    fireEvent.click(screen.getByRole("button", { name: /Buy/i }));

    expect(mockBuy).toHaveBeenCalledWith("banana", 1);

    // Change amount
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: 3 } });
    fireEvent.click(screen.getByRole("button", { name: /Sell/i }));

    expect(mockSell).toHaveBeenCalledWith("banana", 3);
  });

  it("applies correct message colors", () => {
    mockBuy.mockReturnValue(true);
    const { rerender } = render(<FruitViewPanel />);

    // Success message
    fireEvent.click(screen.getByRole("button", { name: /Buy/i }));
    const successMsg = screen.getByText("Bought 1 apple(s).");
    expect(successMsg).toHaveStyle({ color: "#52c41a" });

    // Error message
    mockBuy.mockReturnValue(false);
    rerender(<FruitViewPanel />);
    fireEvent.click(screen.getByRole("button", { name: /Buy/i }));
    const errorMsg = screen.getByText("Not enough apples in inventory.");
    expect(errorMsg).toHaveStyle({ color: "#f5222d" });

    // Info (Sell) message
    rerender(<FruitViewPanel />);
    fireEvent.click(screen.getByRole("button", { name: /Sell/i }));
    const infoMsg = screen.getByText("Sold 1 apple(s).");
    expect(infoMsg).not.toHaveStyle({ color: "#52c41a" });
    expect(infoMsg).not.toHaveStyle({ color: "#f5222d" });
  });
});
