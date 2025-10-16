import React from "react";
import { render, screen } from "@testing-library/react";
import { GridDropOverlay } from "../GridDropOverlay";

describe("GridDropOverlay", () => {
  it("renders the correct number of grid cells", () => {
    const rows = 3;
    const cols = 4;
    render(
      <GridDropOverlay rows={rows} cols={cols} activeCell={null} visible={false} />
    );
    // There should be rows * cols divs inside the container
    const cells = screen.getAllByRole("gridcell");
    expect(cells.length).toBe(rows * cols);
  });

  it("applies correct grid styles for rows and columns", () => {
    const rows = 2;
    const cols = 5;
    const { container } = render(
      <GridDropOverlay rows={rows} cols={cols} activeCell={null} visible={false} />
    );
    const overlayDiv = container.firstChild;
    expect(overlayDiv).toHaveStyle(`grid-template-rows: repeat(${rows}, 1fr)`);
    expect(overlayDiv).toHaveStyle(`grid-template-columns: repeat(${cols}, 1fr)`);
  });

  it("sets correct background and opacity when visible", () => {
    const { container, rerender } = render(
      <GridDropOverlay rows={1} cols={1} activeCell={null} visible={true} />
    );
    const overlayDiv = container.firstChild;
    expect(overlayDiv).toHaveStyle("background: rgba(30,40,80,0.18)");
    expect(overlayDiv).toHaveStyle("opacity: 1");

    // When not visible
    rerender(<GridDropOverlay rows={1} cols={1} activeCell={null} visible={false} />);
    expect(overlayDiv).toHaveStyle("background: transparent");
    expect(overlayDiv).toHaveStyle("opacity: 0");
  });

  it("highlights the active cell correctly", () => {
    const rows = 2;
    const cols = 2;
    const activeCell = { row: 1, col: 0 };
    render(
      <GridDropOverlay rows={rows} cols={cols} activeCell={activeCell} visible={true} />
    );

    const cells = screen.getAllByRole("gridcell");
    // The cell at index (row=1,col=0) is index 2 (because zero-indexed: row * cols + col)
    cells.forEach((cell, idx) => {
      if (idx === 2) {
        expect(cell).toHaveStyle("background: rgba(126,199,255,0.32)");
        expect(cell).toHaveStyle("border-radius: 8px");
        expect(cell).toHaveStyle("box-shadow: 0 0 0 2px #7ec7ff88");
      } else {
        expect(cell).toHaveStyle("background: rgba(255,255,255,0.07)");
        expect(cell).toHaveStyle("border-radius: 0px");
        expect(cell).not.toHaveStyle("box-shadow: 0 0 0 2px #7ec7ff88");
      }
    });
  });
});
