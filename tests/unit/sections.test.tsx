import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IdentitySection from "@/src/components/sections/IdentitySection";
import OperationsSection from "@/src/components/sections/OperationsSection";
import SignalSection from "@/src/components/sections/SignalSection";
import { portfolio } from "@/src/data/portfolio";

describe("IdentitySection", () => {
  it("renders the operator profile from the data file", () => {
    render(<IdentitySection />);

    expect(
      screen.getByRole("heading", { name: /identity/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(portfolio.shortBio)).toBeInTheDocument();
    for (const area of portfolio.focusAreas) {
      expect(screen.getByText(area)).toBeInTheDocument();
    }
  });

  it("shows a placeholder frame instead of a broken image", () => {
    render(<IdentitySection />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText(portfolio.profileImagePath)).toBeInTheDocument();
  });
});

describe("OperationsSection", () => {
  it("lists every project", () => {
    render(<OperationsSection />);
    expect(screen.getAllByTestId("operation-entry")).toHaveLength(
      portfolio.projects.length,
    );
  });

  it("hides links while their values are unresolved placeholders", () => {
    render(<OperationsSection />);
    expect(
      screen.queryByRole("link", { name: /live/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /source/i }),
    ).not.toBeInTheDocument();
  });
});

describe("SignalSection", () => {
  it("renders one row per channel", () => {
    render(<SignalSection />);
    expect(screen.getAllByTestId("signal-channel")).toHaveLength(4);
  });

  it("renders unresolved channels as non-interactive", () => {
    render(<SignalSection />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    for (const row of screen.getAllByTestId("signal-channel")) {
      expect(row.firstElementChild).toHaveAttribute("aria-disabled", "true");
    }
  });
});
