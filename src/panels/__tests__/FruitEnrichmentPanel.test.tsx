import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FruitEnrichmentPanel from "../FruitEnrichmentPanel";

// 🧩 Mock AgGridReact to avoid loading AG Grid internals
jest.mock("ag-grid-react", () => ({
  AgGridReact: jest.fn(() => <div data-testid="mock-ag-grid">Mock AG Grid</div>),
}));

// 🧩 Mock ResizableDraggablePanel to inspect props
const mockResizableDraggablePanel = jest.fn(({ title, content, onClose, onMove, onResize }) => (
  <div data-testid="mock-panel">
    <h2>{title}</h2>
    <button data-testid="close-btn" onClick={onClose}>
      Close
    </button>
    <button data-testid="move-btn" onClick={() => onMove(10, 5)}>
      Move
    </button>
    <button data-testid="resize-btn" onClick={() => onResize(20, 10)}>
      Resize
    </button>
    <div>{content}</div>
  </div>
));

jest.mock("../components/ResizableDraggablePanel", () => ({
  __esModule: true,
  default: (props: any) => mockResizableDraggablePanel(props),
}));

describe("FruitEnrichmentPanel", () => {
  const mockOnClose = jest.fn();

  const mockFruit = {
    id: "F001",
    name: "Banana",
    country: "Ecuador",
    type: "Tropical",
    status: "Available",
    details: "Organic, Fair Trade",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct title and content", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);

    // Title passed to panel
    expect(screen.getByText("Banana Enrichment")).toBeInTheDocument();

    // Mock grid rendered
    expect(screen.getByTestId("mock-ag-grid")).toBeInTheDocument();

    // Wrapper panel rendered
    expect(screen.getByTestId("mock-panel")).toBeInTheDocument();
  });

  it("passes correct props to ResizableDraggablePanel", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);

    const call = mockResizableDraggablePanel.mock.calls[0][0];
    expect(call.id).toBe("fruit-enrichment-F001");
    expect(call.title).toBe("Banana Enrichment");
    expect(call.x).toBe(200);
    expect(call.y).toBe(120);
    expect(call.width).toBe(400);
    expect(call.height).toBe(220);
    expect(typeof call.onMove).toBe("function");
    expect(typeof call.onResize).toBe("function");
  });

  it("calls onClose when Close button clicked", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId("close-btn"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("updates position when onMove is triggered", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    const moveBtn = screen.getByTestId("move-btn");
    fireEvent.click(moveBtn);

    const callAfterMove = mockResizableDraggablePanel.mock.calls[1][0];
    expect(callAfterMove.x).toBeGreaterThan(200);
    expect(callAfterMove.y).toBeGreaterThan(120);
  });

  it("updates size when onResize is triggered", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    const resizeBtn = screen.getByTestId("resize-btn");
    fireEvent.click(resizeBtn);

    const callAfterResize = mockResizableDraggablePanel.mock.calls[1][0];
    expect(callAfterResize.width).toBeGreaterThanOrEqual(320);
    expect(callAfterResize.height).toBeGreaterThanOrEqual(160);
  });

  it("renders row data with fruit details in AgGridReact", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);

    const gridProps = (require("ag-grid-react").AgGridReact as jest.Mock).mock.calls[0][0];
    expect(gridProps.rowData).toEqual([
      { property: "ID", value: "F001" },
      { property: "Country", value: "Ecuador" },
      { property: "Type", value: "Tropical" },
      { property: "Status", value: "Available" },
      { property: "Details", value: "Organic, Fair Trade" },
    ]);
  });
});
