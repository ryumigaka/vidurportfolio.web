import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DecodeText from "@/src/components/ui/DecodeText";
import Value from "@/src/components/ui/Value";

/** The visible half of the component; the other half is screen-reader text. */
function visibleText(host: HTMLElement): string {
  return host.querySelector('[aria-hidden="true"]')?.textContent ?? "";
}

describe("DecodeText", () => {
  it("always exposes the real text to assistive technology", () => {
    render(<DecodeText text="OPERATIONS" />);
    // Present from the first frame, regardless of how far the resolve has got.
    expect(screen.getByText("OPERATIONS")).toBeInTheDocument();
  });

  it("resolves to the real text once the animation completes", async () => {
    render(<DecodeText text="IDENTITY" />);
    const host = screen.getByTestId("decode-text");

    await waitFor(
      () => {
        expect(visibleText(host)).toBe("IDENTITY");
      },
      { timeout: 4000 },
    );
  });

  it("keeps the visible string the same length while resolving", () => {
    render(<DecodeText text="DEPLOYED WORK" />);
    const host = screen.getByTestId("decode-text");
    // Noise stands in character-for-character, so nothing reflows mid-resolve.
    expect(visibleText(host)).toHaveLength("DEPLOYED WORK".length);
  });

  it("renders through Value, so section content decodes too", async () => {
    render(<Value>[PROJECT_TITLE]</Value>);
    const host = screen.getByTestId("decode-text");

    await waitFor(
      () => {
        expect(visibleText(host)).toBe("[PROJECT_TITLE]");
      },
      { timeout: 4000 },
    );
  });

  it("can be opted out of where the effect would not suit", () => {
    render(<Value decode={false}>plain</Value>);
    expect(screen.queryByTestId("decode-text")).not.toBeInTheDocument();
    expect(screen.getByText("plain")).toBeInTheDocument();
  });
});
