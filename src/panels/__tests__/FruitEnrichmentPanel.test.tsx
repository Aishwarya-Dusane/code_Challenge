import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FruitEnrichmentPanel from "../FruitEnrichmentPanel";

// Mock ResizableDraggablePanel to inspect props and simulate events
const mockResizableDraggablePanel = jest.fn(({ title, content, onClose, onMove, onResize, x, y, width, height }) => (
  <div data-testid="mock-panel" data-x={x} data-y={y} data-width={width} data-height={height}>
    <h2>{title}</h2>
    <button data-testid="close-btn" onClick={onClose}>Close</button>
    <button data-testid="move-btn" onClick={() => onMove(10, 5)}>Move</button>
    <button data-testid="resize-btn" onClick={() => onResize(20, 10)}>Resize</button>
    <div>{content}</div>
  </div>
));

jest.mock("../../components/ResizableDraggablePanel", () => ({
  __esModule: true,
  default: (props: any) => mockResizableDraggablePanel(props),
}));

// Mock AgGridReact to avoid rendering complexity
jest.mock("ag-grid-react", () => ({
  AgGridReact: jest.fn(() => <div data-testid="mock-ag-grid" />),
}));

describe("FruitEnrichmentPanel", () => {
  const mockFruit = {
    id: "F001",
    name: "Banana",
    country: "Ecuador",
    type: "Tropical",
    status: "Available",
    details: "Organic, Fair Trade",
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls onClose callback when Close button is clicked", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId("close-btn"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("updates position when onMove is triggered", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    
    // Initial call props
    const firstCallProps = mockResizableDraggablePanel.mock.calls[0][0];
    expect(firstCallProps.x).toBe(200);
    expect(firstCallProps.y).toBe(120);

    // Trigger move event
    fireEvent.click(screen.getByTestId("move-btn"));

    // The panel should re-render with updated x/y
    const secondCallProps = mockResizableDraggablePanel.mock.calls[1][0];
    expect(secondCallProps.x).toBeGreaterThan(200);
    expect(secondCallProps.y).toBeGreaterThan(120);
  });

  it("updates size when onResize is triggered", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    
    // Initial call props
    const firstCallProps = mockResizableDraggablePanel.mock.calls[0][0];
    expect(firstCallProps.width).toBe(400);
    expect(firstCallProps.height).toBe(220);

    // Trigger resize event
    fireEvent.click(screen.getByTestId("resize-btn"));

    // The panel should re-render with updated width/height
    const secondCallProps = mockResizableDraggablePanel.mock.calls[1][0];
    expect(secondCallProps.width).toBeGreaterThanOrEqual(320);
    expect(secondCallProps.height).toBeGreaterThanOrEqual(160);
  });

  it("passes correct row data to AgGridReact", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    
    // Extract props passed to AgGridReact from the first call
    const agGridProps = require("ag-grid-react").AgGridReact.mock.calls[0][0];
    expect(agGridProps.rowData).toEqual([
      { property: "ID", value: "F001" },
      { property: "Country", value: "Ecuador" },
      { property: "Type", value: "Tropical" },
      { property: "Status", value: "Available" },
      { property: "Details", value: "Organic, Fair Trade" },
    ]);
  });
});
