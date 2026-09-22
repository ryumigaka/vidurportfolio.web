import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import AppShell from "@/src/components/shell/AppShell";
import { portfolio } from "@/src/data/portfolio";

afterEach(() => {
  window.history.pushState(null, "", "/");
});

/** Both the desktop and mobile compositions are in the DOM; CSS decides which
 *  one is visible, so tests act on the first match. */
function firstNode(testId: string): HTMLElement {
  return screen.getAllByTestId(testId)[0];
}

describe("AppShell", () => {
  it("opens on the core with all three navigation nodes", () => {
    render(<AppShell />);

    expect(screen.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "home",
    );
    expect(firstNode("node-identity")).toBeInTheDocument();
    expect(firstNode("node-operations")).toBeInTheDocument();
    expect(firstNode("node-signal")).toBeInTheDocument();
    expect(screen.getAllByText(portfolio.fullName).length).toBeGreaterThan(0);
  });

  it("sets the home document title", () => {
    render(<AppShell />);
    expect(document.title).toBe(`${portfolio.fullName} — Portfolio`);
  });

  it("navigates to a section, updating the hash and the title", async () => {
    const user = userEvent.setup();
    render(<AppShell />);

    await user.click(firstNode("node-operations"));

    await waitFor(() => {
      expect(screen.getByTestId("view-root")).toHaveAttribute(
        "data-view",
        "operations",
      );
    });
    expect(window.location.hash).toBe("#operations");
    expect(document.title).toBe(`Operations — ${portfolio.fullName}`);
    expect(
      screen.getByRole("heading", { name: /operations/i }),
    ).toBeInTheDocument();
  });

  it("renders a deep-linked section on first paint", async () => {
    window.history.pushState(null, "", "/#signal");
    render(<AppShell />);

    await waitFor(() => {
      expect(screen.getByTestId("view-root")).toHaveAttribute(
        "data-view",
        "signal",
      );
    });
    expect(document.title).toBe(`Signal — ${portfolio.fullName}`);
  });

  it("restores the view on browser back and forward", async () => {
    const user = userEvent.setup();
    render(<AppShell />);

    await user.click(firstNode("node-identity"));
    await waitFor(() => {
      expect(screen.getByTestId("view-root")).toHaveAttribute(
        "data-view",
        "identity",
      );
    });

    // Simulate the browser going back to the core.
    window.history.pushState(null, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));

    await waitFor(() => {
      expect(screen.getByTestId("view-root")).toHaveAttribute(
        "data-view",
        "home",
      );
    });

    // ...and forward again.
    window.history.pushState(null, "", "/#identity");
    window.dispatchEvent(new PopStateEvent("popstate"));

    await waitFor(() => {
      expect(screen.getByTestId("view-root")).toHaveAttribute(
        "data-view",
        "identity",
      );
    });
  });

  it("returns to the core when Escape is pressed inside a section", async () => {
    const user = userEvent.setup();
    render(<AppShell />);

    await user.click(firstNode("node-signal"));
    await waitFor(() => {
      expect(screen.getByTestId("view-root")).toHaveAttribute(
        "data-view",
        "signal",
      );
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.getByTestId("view-root")).toHaveAttribute(
        "data-view",
        "home",
      );
    });
    expect(window.location.hash).toBe("");
  });

  it("keeps the persistent shell mounted across views", async () => {
    const user = userEvent.setup();
    render(<AppShell />);

    const coreBefore = screen.getByTestId("system-core");
    expect(coreBefore).toHaveAttribute("data-view", "home");
    expect(screen.getByTestId("status-bar")).toBeInTheDocument();

    await user.click(firstNode("node-operations"));

    await waitFor(() => {
      expect(screen.getByTestId("system-core")).toHaveAttribute(
        "data-view",
        "operations",
      );
    });
    expect(screen.getByTestId("status-bar")).toBeInTheDocument();
    expect(screen.getByTestId("grid-traces")).toBeInTheDocument();
  });
});
