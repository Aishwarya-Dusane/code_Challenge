import React from "react";
import { render, screen } from "@testing-library/react";
import EnrichmentPanel from "../EnrichmentPanel";
import { MESSAGES } from "../constants/messages";
import { enrichmentData } from "../../data/enrichmentData";

// Mock enrichmentData if needed
jest.mock("../data/enrichmentData", () => ({
  enrichmentData: {
    Apple: "Rich in fiber and vitamins",
  },
}));

describe("EnrichmentPanel", () => {
  it("renders the fruit name in the title", () => {
    render(<EnrichmentPanel fruit="Apple" />);
    expect(screen.getByText(/Apple Enrichment/i)).toBeInTheDocument();
  });

  it("displays enrichment data when available", () => {
    render(<EnrichmentPanel fruit="Apple" />);
    expect(screen.getByText("Rich in fiber and vitamins")).toBeInTheDocument();
  });

  it("displays fallback message when no enrichment data is available", () => {
    render(<EnrichmentPanel fruit="Banana" />);
    expect(screen.getByText(MESSAGES.NO_ENRICHMENT_DATA)).toBeInTheDocument();
  });
});
