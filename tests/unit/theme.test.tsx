import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import AppShell from "@/src/components/shell/AppShell";
import {
  DEFAULT_THEME,
  THEME_BOOT_SCRIPT,
  THEME_STORAGE_KEY,
  isTheme,
  rgba,
} from "@/src/lib/theme";

beforeEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
});

afterEach(() => {
  window.history.pushState(null, "", "/");
});

describe("theme helpers", () => {
  it("recognises only the two supported themes", () => {
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("light")).toBe(true);
    expect(isTheme("solarized")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it("builds canvas colours from raw channel tokens", () => {
    expect(rgba("47 243 200", 0.5)).toBe("rgba(47, 243, 200, 0.5)");
    expect(rgba("204 26 26", 1)).toBe("rgba(204, 26, 26, 1)");
  });

  it("ships a boot script that reads the same storage key", () => {
    expect(THEME_BOOT_SCRIPT).toContain(THEME_STORAGE_KEY);
    expect(THEME_BOOT_SCRIPT).toContain("data");
    // Must not throw when storage is unavailable.
    expect(THEME_BOOT_SCRIPT).toContain("catch");
  });
});

describe("theme toggle", () => {
  it("starts on the default theme", () => {
    render(<AppShell />);
    expect(screen.getByTestId("theme-toggle")).toHaveAttribute(
      "data-theme-state",
      DEFAULT_THEME,
    );
  });

  it("flips the document attribute and persists the choice", async () => {
    const user = userEvent.setup();
    render(<AppShell />);

    await user.click(screen.getByTestId("theme-toggle"));

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("light");
    });
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(screen.getByTestId("shell-root")).toHaveAttribute(
      "data-theme-state",
      "light",
    );
  });

  it("toggles back to dark", async () => {
    const user = userEvent.setup();
    render(<AppShell />);

    const toggle = screen.getByTestId("theme-toggle");
    await user.click(toggle);
    await waitFor(() =>
      expect(document.documentElement.dataset.theme).toBe("light"),
    );

    await user.click(toggle);
    await waitFor(() =>
      expect(document.documentElement.dataset.theme).toBe("dark"),
    );
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("restores a stored theme on mount", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    render(<AppShell />);

    await waitFor(() => {
      expect(screen.getByTestId("theme-toggle")).toHaveAttribute(
        "data-theme-state",
        "light",
      );
    });
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("ignores a corrupted stored value", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "neon");
    render(<AppShell />);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe(DEFAULT_THEME);
    });
  });

  it("announces the mode it switches to", () => {
    render(<AppShell />);
    expect(screen.getByTestId("theme-toggle")).toHaveAttribute(
      "aria-label",
      "Switch to light mode",
    );
  });

  it("stays reachable from the core view, where the section rail is hidden", () => {
    render(<AppShell />);
    expect(screen.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "home",
    );
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});
