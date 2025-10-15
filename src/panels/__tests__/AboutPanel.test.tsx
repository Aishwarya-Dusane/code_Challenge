import React from "react";
import { render, screen } from "@testing-library/react";
import AboutPanel from "../AboutPanel";

describe("AboutPanel", () => {
  it("renders the About heading", () => {
    render(<AboutPanel />);
    const heading = screen.getByRole("heading", { name: /about/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("About");
  });

  it("displays the welcome message with app name", () => {
    render(<AboutPanel />);
    expect(screen.getByText(/welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/fruteria/i)).toBeInTheDocument();
  });

  it("mentions that it is a trading app for fruit", () => {
    render(<AboutPanel />);
    expect(screen.getByText(/trading app for fruit/i)).toBeInTheDocument();
  });

  it("includes a fun footer message", () => {
    render(<AboutPanel />);
    expect(screen.getByText(/made with/i)).toBeInTheDocument();
    expect(screen.getByText(/🍌/)).toBeInTheDocument();
    expect(screen.getByText(/❤️/)).toBeInTheDocument();
  });

  it("has inline styles applied to the container", () => {
    const { container } = render(<AboutPanel />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle({
      padding: "24px",
      color: "#e0e0e0",
      fontFamily: "monospace",
    });
  });
});
