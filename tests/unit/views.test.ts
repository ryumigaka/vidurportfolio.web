import { describe, expect, it } from "vitest";
import {
  hashForView,
  titleForView,
  viewFromHash,
  NODE_VIEWS,
  VIEWS,
  VIEW_META,
  type ActiveView,
} from "@/src/lib/views";

describe("viewFromHash", () => {
  it("maps each known hash to its view", () => {
    expect(viewFromHash("#identity")).toBe("identity");
    expect(viewFromHash("#operations")).toBe("operations");
    expect(viewFromHash("#signal")).toBe("signal");
  });

  it("treats an empty hash as home", () => {
    expect(viewFromHash("")).toBe("home");
    expect(viewFromHash("#")).toBe("home");
  });

  it("falls back to home for unknown or malformed hashes", () => {
    expect(viewFromHash("#nope")).toBe("home");
    expect(viewFromHash("#../../etc/passwd")).toBe("home");
  });

  it("is case and whitespace insensitive", () => {
    expect(viewFromHash("#IDENTITY")).toBe("identity");
    expect(viewFromHash("#  signal  ")).toBe("signal");
  });
});

describe("hashForView", () => {
  it("clears the hash for home and sets it for sections", () => {
    expect(hashForView("home")).toBe("/");
    expect(hashForView("identity")).toBe("/#identity");
    expect(hashForView("operations")).toBe("/#operations");
    expect(hashForView("signal")).toBe("/#signal");
  });

  it("round-trips every view through its hash", () => {
    for (const view of VIEWS) {
      expect(viewFromHash(hashForView(view).replace("/", ""))).toBe(view);
    }
  });
});

describe("titleForView", () => {
  const name = "[FULL_NAME]";

  it("uses the portfolio title on home", () => {
    expect(titleForView("home", name)).toBe("[FULL_NAME] — Portfolio");
  });

  it("puts the section first everywhere else", () => {
    expect(titleForView("identity", name)).toBe("Identity — [FULL_NAME]");
    expect(titleForView("operations", name)).toBe("Operations — [FULL_NAME]");
    expect(titleForView("signal", name)).toBe("Signal — [FULL_NAME]");
  });
});

describe("view metadata", () => {
  it("covers every view", () => {
    for (const view of VIEWS) {
      expect(VIEW_META[view as ActiveView]).toBeDefined();
    }
  });

  it("exposes exactly three navigable nodes, excluding home", () => {
    expect(NODE_VIEWS).toHaveLength(3);
    expect(NODE_VIEWS).not.toContain("home");
  });

  it("gives each node a unique two-digit code", () => {
    const codes = VIEWS.map((view) => VIEW_META[view].code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const code of codes) expect(code).toMatch(/^\d{2}$/);
  });
});
