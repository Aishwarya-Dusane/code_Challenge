import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FruitBook from "../FruitBookPanel";
import ReactDOM from "react-dom";

// 🧩 Mock the FruitEnrichmentPanel to avoid deep rendering
jest.mock("./FruitEnrichmentPanel", () => ({
  __esModule: true,
  default: ({ fruit, onClose }: any) => (
    <div data-testid="fruit-enrichment">
      Enrichment for {fruit.name}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// 🧩 Mock AG Grid React component
jest.mock("ag-grid-react", () => ({
  AgGridReact: jest.fn(({ onRowDoubleClicked, onSelectionChanged }) => (
    <div>
      <div
        data-testid="mock-grid-row"
        onDoubleClick={() =>
          onRowDoubleClicked?.({ data: { id: "F001", name: "Banana" } })
        }
      >
        Mock Grid Row
      </div>
      <button
        data-testid="mock-selection"
        onClick={() =>
          onSelectionChanged?.({
            api: { getSelectedNodes: () => [{ data: { id: "F002", name: "Apple" } }] },
          })
        }
      >
        Trigger Selection
      </button>
    </div>
  )),
}));

// 🧩 Mock ReactDOM.createPortal to render directly
jest.spyOn(ReactDOM, "createPortal").mockImplementation((element: any) => element);

describe("FruitBook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Fruit Book title", () => {
    render(<FruitBook />);
    expect(screen.getByText("Fruit Book")).toBeInTheDocument();
  });

  it("renders the mock AG Grid", () => {
    render(<FruitBook />);
    expect(screen.getByTestId("mock-grid-row")).toBeInTheDocument();
  });

  it("opens the enrichment panel when a row is double-clicked", () => {
    render(<FruitBook />);
    fireEvent.doubleClick(screen.getByTestId("mock-grid-row"));
    expect(screen.getByTestId("fruit-enrichment")).toHaveTextContent("Enrichment for Banana");
  });

  it("opens the enrichment panel when selection changes", () => {
    render(<FruitBook />);
    fireEvent.click(screen.getByTestId("mock-selection"));
    expect(screen.getByTestId("fruit-enrichment")).toHaveTextContent("Enrichment for Apple");
  });

  it("closes the enrichment panel when the close button is clicked", () => {
    render(<FruitBook />);
    fireEvent.doubleClick(screen.getByTestId("mock-grid-row"));
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(screen.queryByTestId("fruit-enrichment")).not.toBeInTheDocument();
  });

  it("renders correct layout structure", () => {
    const { container } = render(<FruitBook />);
    const wrapperDivs = container.querySelectorAll("div");
    expect(wrapperDivs.length).toBeGreaterThan(0);
    expect(container.firstChild).toHaveStyle({ background: "#232b3e" });
  });
});
