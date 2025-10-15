import React from "react";
import { render, screen } from "@testing-library/react";
import { GridDropOverlay } from "../GridDropOverlay";

describe("GridDropOverlay", () => {
  it("renders the correct number of grid cells", () => {
    render(<GridDropOverlay rows={2} cols={3} activeCell={null} visible={true} />);

    // 2 rows * 3 columns = 6 cells
    const cells = screen.getAllByRole("generic");
    expect(cells.length).toBe(7); // 1 parent div + 6 grid cells
  });

  it("applies transparent background when not visible", () => {
    render(<GridDropOverlay rows={1} cols={1} activeCell={null} visible={false} />);
    const overlay = screen.getByRole("generic", { hidden: true });
    expect(overlay).toHaveStyle("background: transparent");
    expect(overlay).toHaveStyle("opacity: 0");
  });

  it("applies semi-transparent background when visible", () => {
    render(<GridDropOverlay rows={1} cols={1} activeCell={null} visible={true} />);
    const overlay = screen.getByRole("generic", { hidden: true });
    expect(overlay).toHaveStyle("background: rgba(30,40,80,0.18)");
    expect(overlay).toHaveStyle("opacity: 1");
  });

  it("highlights the active cell correctly", () => {
    render(
      <GridDropOverlay
        rows={2}
        cols={2}
        activeCell={{ row: 1, col: 1 }}
        visible={true}
      />
    );

    const cells = screen.getAllByRole("generic");
    const activeCell = cells.find((cell) =>
      cell.getAttribute("style")?.includes("rgba(126,199,255,0.32)")
    );

    expect(activeCell).toBeTruthy();
    expect(activeCell).toHaveStyle("border-radius: 8px");
    expect(activeCell).toHaveStyle("box-shadow: 0 0 0 2px #7ec7ff88");
  });

  it("renders inactive cells with default background", () => {
    render(
      <GridDropOverlay
        rows={2}
        cols={2}
        activeCell={{ row: 0, col: 0 }}
        visible={true}
      />
    );

    const cells = screen.getAllByRole("generic");
    const inactiveCells = cells.filter(
      (cell) => !cell.getAttribute("style")?.includes("rgba(126,199,255,0.32)")
    );

    expect(inactiveCells.length).toBeGreaterThan(0);
    inactiveCells.forEach((cell) => {
      expect(cell).toHaveStyle("background: rgba(255,255,255,0.07)");
    });
  });
});
