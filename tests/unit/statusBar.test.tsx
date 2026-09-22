import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import StatusBar from "@/src/components/shell/StatusBar";
import { portfolio } from "@/src/data/portfolio";

function mockIpResponse(body: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      json: async () => body,
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("StatusBar visitor address", () => {
  it("renders the address the echo service returns", async () => {
    mockIpResponse({ ip: "203.0.113.7" });
    render(<StatusBar view="home" />);

    await waitFor(() => {
      expect(screen.getByTestId("visitor-ip")).toHaveTextContent("203.0.113.7");
    });
  });

  it("omits the readout when the lookup fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("blocked")));
    render(<StatusBar view="home" />);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(screen.queryByTestId("visitor-ip")).not.toBeInTheDocument();
  });

  it("rejects a value that is not address-shaped", async () => {
    mockIpResponse({ ip: "not an address" });
    render(<StatusBar view="home" />);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(screen.queryByTestId("visitor-ip")).not.toBeInTheDocument();
  });

  it("omits the readout on a non-ok response", async () => {
    mockIpResponse({ ip: "203.0.113.7" }, false);
    render(<StatusBar view="home" />);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(screen.queryByTestId("visitor-ip")).not.toBeInTheDocument();
  });
});

describe("operator identity", () => {
  it("carries both the handle and the civilian name", () => {
    expect(portfolio.fullName).toBe("Ryumigaka");
    expect(portfolio.alias).toBe("Vidur");
    expect(portfolio.handle).toBe("ryumigaka");
  });
});
