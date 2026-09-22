import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IdentitySection from "@/src/components/sections/IdentitySection";
import OperationsSection from "@/src/components/sections/OperationsSection";
import PrimaryChannel from "@/src/components/sections/PrimaryChannel";
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

  it("makes the resolved email channel a real mailto link", () => {
    render(<SignalSection />);
    const mailto = screen.getByRole("link");
    expect(mailto).toHaveAttribute("href", `mailto:${portfolio.email}`);
    expect(mailto).not.toHaveAttribute("target");
  });

  it("leaves channels without a value non-interactive", () => {
    render(<SignalSection />);
    const rows = screen.getAllByTestId("signal-channel");
    const inert = rows.filter(
      (row) => row.firstElementChild?.getAttribute("aria-disabled") === "true",
    );
    // Everything except the email channel is still an unset placeholder.
    expect(inert).toHaveLength(rows.length - 1);
  });
});

describe("PrimaryChannel", () => {
  it("is a mailto call to action once an address is set", () => {
    render(<PrimaryChannel />);
    const cta = screen.getByTestId("primary-channel");
    expect(cta).toHaveAttribute("href", `mailto:${portfolio.email}`);
    expect(cta).toHaveTextContent(portfolio.email);
  });
});
