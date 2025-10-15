import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MainWorkspace } from "../MainWorkspace";
import { GridDropOverlay } from "../GridDropOverlay";

// Mock GridDropOverlay to simplify verification
jest.mock("./GridDropOverlay", () => ({
  GridDropOverlay: jest.fn(() => <div data-testid="grid-overlay" />),
}));

describe("MainWorkspace", () => {
  const mockOnDrop = jest.fn();
  const mockOnDragOver = jest.fn();
  const mockOnGridDropInfo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children and GridDropOverlay", () => {
    render(
      <MainWorkspace onDrop={mockOnDrop} onDragOver={mockOnDragOver}>
        <div data-testid="child">Child</div>
      </MainWorkspace>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("grid-overlay")).toBeInTheDocument();
  });

  it("shows overlay when dragging starts via dragenter event", () => {
    render(
      <MainWorkspace onDrop={mockOnDrop} onDragOver={mockOnDragOver}>
        <div>child</div>
      </MainWorkspace>
    );

    const workspace = screen.getByRole("generic");
    fireEvent.dragEnter(workspace);

    // GridDropOverlay should receive visible = true
    expect(GridDropOverlay).toHaveBeenCalledWith(
      expect.objectContaining({ visible: true }),
      {}
    );
  });

  it("hides overlay when dragleave event occurs", () => {
    render(
      <MainWorkspace
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onGridDropInfo={mockOnGridDropInfo}
      >
        <div>child</div>
      </MainWorkspace>
    );

    const workspace = screen.getByRole("generic");
    fireEvent.dragEnter(workspace);
    fireEvent.dragLeave(workspace);

    expect(mockOnGridDropInfo).toHaveBeenCalledWith(
      expect.objectContaining({ cell: null })
    );
  });

  it("calls onDrop and resets state after drop", () => {
    render(
      <MainWorkspace
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onGridDropInfo={mockOnGridDropInfo}
      >
        <div>child</div>
      </MainWorkspace>
    );

    const workspace = screen.getByRole("generic");
    fireEvent.drop(workspace);

    expect(mockOnDrop).toHaveBeenCalled();
    expect(mockOnGridDropInfo).toHaveBeenCalledWith(
      expect.objectContaining({ cell: null })
    );
  });

  it("computes active cell correctly on dragOver", () => {
    render(
      <MainWorkspace
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onGridDropInfo={mockOnGridDropInfo}
        gridRows={2}
        gridCols={2}
      >
        <div>child</div>
      </MainWorkspace>
    );

    const workspace = screen.getByRole("generic");
    // Mock getBoundingClientRect
    jest.spyOn(workspace, "getBoundingClientRect").mockReturnValue({
      width: 200,
      height: 200,
      left: 0,
      top: 0,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Drag in bottom-right quadrant
    fireEvent.dragOver(workspace, { clientX: 150, clientY: 150 });

    expect(mockOnDragOver).toHaveBeenCalled();
    expect(mockOnGridDropInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        cell: { row: 1, col: 1 },
      })
    );
  });

  it("responds to Escape key by resetting drag state", () => {
    render(
      <MainWorkspace onDrop={mockOnDrop} onDragOver={mockOnDragOver}>
        <div>child</div>
      </MainWorkspace>
    );

    fireEvent.keyDown(window, { key: "Escape" });

    // GridDropOverlay should now have visible=false
    expect(GridDropOverlay).toHaveBeenCalledWith(
      expect.objectContaining({ visible: false }),
      {}
    );
  });

  it("responds to custom panel drag events", () => {
    render(
      <MainWorkspace onDrop={mockOnDrop} onDragOver={mockOnDragOver}>
        <div>child</div>
      </MainWorkspace>
    );

    window.dispatchEvent(new Event("panel-drag-start"));
    expect(GridDropOverlay).toHaveBeenLastCalledWith(
      expect.objectContaining({ visible: true }),
      {}
    );

    window.dispatchEvent(new Event("panel-drag-end"));
    expect(GridDropOverlay).toHaveBeenLastCalledWith(
      expect.objectContaining({ visible: false }),
      {}
    );
  });
});
