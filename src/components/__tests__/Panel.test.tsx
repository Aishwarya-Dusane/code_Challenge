import React from "react";
import { render, screen } from "@testing-library/react";
import Panel from "../Panel";

describe("Panel Component", () => {
  it("renders the title text", () => {
    render(<Panel title="Test Panel">Panel content</Panel>);
    expect(screen.getByText("Test Panel")).toBeInTheDocument();
  });

  it("renders the children correctly", () => {
    render(
      <Panel title="Info Panel">
        <p>This is some content</p>
      </Panel>
    );

    expect(screen.getByText("This is some content")).toBeInTheDocument();
  });


  it("renders title section with proper font styling", () => {
    render(<Panel title="Title Style Check">Child</Panel>);
    const titleElement = screen.getByText("Title Style Check");

    expect(titleElement).toHaveStyle({
      fontWeight: "700",
      fontSize: "20px",
      color: "#fff",
    });
  });

});
