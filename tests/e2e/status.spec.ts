import { expect, test, type Page } from "@playwright/test";

async function open(page: Page, path: string) {
  await page.goto(path);
  await page
    .locator('[data-testid="shell-root"][data-hydrated="true"]')
    .waitFor();
}

test.describe("visitor address readout", () => {
  test("shows the address once the echo service answers", async ({ page }) => {
    await page.route(/api\.ipify\.org/, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ip: "203.0.113.7" }),
      }),
    );

    await open(page, "/");
    await expect(page.getByTestId("visitor-ip")).toContainText("203.0.113.7");
  });

  test("stays silent when the lookup is blocked", async ({ page }) => {
    await page.route(/api\.ipify\.org/, (route) => route.abort());

    await open(page, "/");
    await expect(page.getByTestId("status-bar")).toBeVisible();
    await expect(page.getByTestId("visitor-ip")).toHaveCount(0);
  });

  test("ignores a malformed response rather than printing junk", async ({
    page,
  }) => {
    await page.route(/api\.ipify\.org/, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ip: "<script>alert(1)</script>" }),
      }),
    );

    await open(page, "/");
    await page.waitForTimeout(500);
    await expect(page.getByTestId("visitor-ip")).toHaveCount(0);
  });

  test("a blocked lookup never breaks the shell", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.route(/api\.ipify\.org/, (route) => route.abort());
    await open(page, "/");

    await expect(page.getByTestId("system-core")).toBeVisible();
    await expect(page.getByTestId("view-root")).toHaveAttribute(
      "data-view",
      "home",
    );
    expect(pageErrors).toEqual([]);
  });
});
