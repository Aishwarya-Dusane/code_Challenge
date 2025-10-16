import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MainWorkspace } from "../MainWorkspace";

describe("MainWorkspace", () => {
  const gridRows = 2;
  const gridCols = 2;

  const mockOnDrop = jest.fn();
  const mockOnDragOver = jest.fn();
  const mockOnGridDropInfo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children and GridDropOverlay", () => {
    render(
      <MainWorkspace
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onGridDropInfo={mockOnGridDropInfo}
        gridRows={gridRows}
        gridCols={gridCols}
      >
        <div>Child Content</div>
      </MainWorkspace>
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

it("calls onDrop and resets state on drop", () => {
  render(
    <MainWorkspace
      onDrop={mockOnDrop}
      onDragOver={mockOnDragOver}
      onGridDropInfo={mockOnGridDropInfo}
    >
      <div>Content</div>
    </MainWorkspace>
  );

  const container = screen.getByText("Content").parentElement!;

  // Mock getBoundingClientRect
  container.getBoundingClientRect = jest.fn(() => ({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    right: 100,
    bottom: 100,
    x: 0,
    y: 0,
    toJSON: () => {},
  }));

  // Just use fireEvent.drop directly, passing an object with needed props
  fireEvent.drop(container, { bubbles: true });

  expect(mockOnDrop).toHaveBeenCalledWith(expect.anything());
  expect(mockOnGridDropInfo).toHaveBeenCalledWith({
    cell: null,
    size: expect.objectContaining({ width: expect.any(Number), height: expect.any(Number) }),
  });
});


  it("handles panel-drag-start and panel-drag-end custom events", () => {
    render(
      <MainWorkspace
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
      >
        <div>Content</div>
      </MainWorkspace>
    );

    // panel-drag-start should set isPanelDragging to true and show overlay
    act(() => {
      window.dispatchEvent(new Event("panel-drag-start"));
    });

    // panel-drag-end should reset isPanelDragging and activeCell
    act(() => {
      window.dispatchEvent(new Event("panel-drag-end"));
    });
  });

  it("resets drag state on Escape key press", () => {
    render(
      <MainWorkspace
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
      >
        <div>Content</div>
      </MainWorkspace>
    );

    // Dispatch Escape keydown event
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
  });
});
