import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IdentitySection from "@/src/components/sections/IdentitySection";
import OperationsSection from "@/src/components/sections/OperationsSection";
import PrimaryChannel from "@/src/components/sections/PrimaryChannel";
import SignalSection from "@/src/components/sections/SignalSection";
import { isResolvedLink, portfolio } from "@/src/data/portfolio";

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

  it("only links projects whose values are resolved", () => {
    render(<OperationsSection />);
    const live = portfolio.projects.filter((p) => isResolvedLink(p.url));
    const source = portfolio.projects.filter((p) =>
      isResolvedLink(p.repository),
    );
    expect(screen.queryAllByRole("link", { name: /live/i })).toHaveLength(
      live.length,
    );
    expect(screen.queryAllByRole("link", { name: /source/i })).toHaveLength(
      source.length,
    );
  });
});

describe("SignalSection", () => {
  it("renders one row per channel", () => {
    render(<SignalSection />);
    expect(screen.getAllByTestId("signal-channel")).toHaveLength(5);
  });

  it("opens the email channel in the mail client, not a new tab", () => {
    render(<SignalSection />);
    const mailto = screen.getByRole("link", {
      name: new RegExp(portfolio.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    });
    expect(mailto).toHaveAttribute("href", `mailto:${portfolio.email}`);
    expect(mailto).not.toHaveAttribute("target");
  });

  it("links exactly the channels whose values are set", () => {
    render(<SignalSection />);
    const resolvedValues = [
      portfolio.email,
      portfolio.githubUrl,
      portfolio.linkedinUrl,
      portfolio.instagramUrl,
      portfolio.xUrl,
    ].filter((value) => isResolvedLink(value));

    expect(screen.getAllByRole("link")).toHaveLength(resolvedValues.length);

    const rows = screen.getAllByTestId("signal-channel");
    const inert = rows.filter(
      (row) => row.firstElementChild?.getAttribute("aria-disabled") === "true",
    );
    expect(inert).toHaveLength(rows.length - resolvedValues.length);
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
